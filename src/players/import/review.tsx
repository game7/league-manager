import * as React from 'react';
import { Component } from 'react';
import { withRouter } from 'react-router';
import * as _ from 'lodash';
import { IImportState, Header, row, storage, Map, Column, Properties } from './common';
import { Store, Team, PlayerUpload } from '../store';
import * as moment from 'moment';

const getTeam = function(){
  let map = {};
  return (teams: Team[], id: string) : Team => {
    let team = map[id];
    if(!team) {
      team = teams.filter(t => t.id == id)[0];
      map[id] = team;
    }
    return team;
  }
}();

export function makePlayers(state: IReviewState): PlayerUpload[] {
  let { rows, hasHeader, teams } = state;
  if(hasHeader) [ , ...rows] = rows;

  // for each row
  const data = rows.map(row => {
    let item = {}
    // for each column
    state.columns.forEach((col, i) => {
      let key = col.property;
      switch (key) {
        case 'team':
          item[key] = state.teamMaps.filter(map => map.key == row[i])[0];
          break;
        case 'email':
          if(row[i]) item[key] = row[i].trim().toLowerCase();
          break;
        case 'position':
          if(row[i]) item[key] = row[i].trim().toUpperCase()[0];
          break;
        case 'substitute':
          item[key] = (row[i] && row[i].toLowerCase() == 'true');
          break;
        default:
          item[key] = row[i];
      }
    });
    return item;
  });
  // get mapped value
  const players = data.map((item: any) => {
    return {
      firstName: item.firstName,
      lastName: item.lastName,
      team: getTeam(teams, item.team.id),
      jerseyNumber: item.jerseyNumber,
      email: item.email,
      birthdate: item.birthdate,
      position: item.position,
      substitute: item.substitute
    } as PlayerUpload;
  });

  return players

}

interface IReviewProps {
  router: any
}

interface IReviewState extends IImportState {
  players?: PlayerUpload[];
  isProcessing?: boolean;
  isCompleted?: boolean;
}

class Review extends Component<IReviewProps,IReviewState> {

  constructor() {
    super();
    this.state = Object.assign({}, storage.load());
    const { columns, rows, hasHeader } = this.state;
    this.state.players = makePlayers(this.state);
  }

  handleCompleted = () => {
    this.setState({
      file: undefined,
      delimiter: undefined,
      hasHeader: undefined,
      rows: undefined,
      columns: undefined,
      teamMaps: undefined
    }, () => storage.save(this.state));
    this.props.router.push('/players')
  }

  handleCreatePlayers = () => {
    this.setState({ isProcessing: true });
    let payload = {
      player: this.state.players.map(g => {
        return {
          first_name: g.firstName,
          last_name: g.lastName,
          team_id: g.team.id,
          jersey_number: g.jerseyNumber,
          email: g.email ? g.email.toLowerCase() : null,
          birthdate: g.birthdate ? moment(new Date(g.birthdate)).format('M/D/YY') : null,
          position: g.position,
          substitute: !!g.substitute
        }
      })
    }
    Store.createPlayers(payload).then((response) => {
        if(response['ok']) {
          alert('That Worked!');
          this.setState({ isCompleted: true })
        } else {
          response['text']().then(text => {
            alert(`Oops!  Something didn\'t go right...\n\n${text}`);
            this.setState({ isProcessing: false });
          })

        }
    })
  }

  render() {
    let createButtonCss = ['btn', 'btn-primary'];
    if(this.state.isProcessing) {
      createButtonCss.push('disabled');
    }
    let completedButtonCss = ['btn', 'btn-primary'];
    if(!this.state.isCompleted) {
      completedButtonCss.push('disabled');
    }
    return (
      <div>
        <Header
          title="Review"
          canBack={true}
          backUrl="/players/import/mapping"
          canNext={false}
        />
        <p>
          <em>Scroll to review and submit</em>
        </p>
        <table className="table table-bordered table-striped">
          <thead>
            <tr>
              <th>First</th>
              <th>Last</th>
              <th>Team</th>
              <th>#</th>
              <th>Birthdate</th>
              <th>Email</th>
              <th>Pos</th>
              <th>Sub</th>
            </tr>
          </thead>
          <tbody>
            {this.state.players.map((g, i)=> (
              <tr key={i}>
                {/*
                <td style={{textAlign: 'center'}}>
                  <input type="checkbox" checked={g.selected} onChange={this.handleGameToggle(g.id)}/>
                </td>
                */}
                <td>{g['firstName']}</td>
                <td>{g['lastName']}</td>
                <td>{g['team']['name']}</td>
                <td>{g['jerseyNumber']}</td>
                <td>{g['birthdate'] ? moment(new Date(g['birthdate'])).format('M/D/YY').replace('m','') : ''}</td>
                <td>{g['email']}</td>
                <td>{g['position']}</td>
                <td>{g['substitute'] ? 'X' : ''}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <button className={createButtonCss.join(' ')} onClick={this.handleCreatePlayers}>Create Players</button>
        {" "}
        <button className={completedButtonCss.join(' ')} onClick={this.handleCompleted}>Done</button>
        <p style={{height: 20}}> </p>
      </div>
    );
  }
}

export default withRouter(Review);
