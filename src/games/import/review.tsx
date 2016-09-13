import * as React from 'react';
import { Component } from 'react';
import * as _ from 'lodash';
import { IImportState, Header, row, storage, Map, Column, Properties } from './common';
import { Store, Team, Location, GameUpload } from '../store';
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

const getLocation = function(){
  let map = {};
  return (locations: Location[], id: string) : Location => {
    let location = map[id];
    if(!location) {
      location = locations.filter(t => t.id == id)[0];
      map[id] = location;
    }
    return location;
  }
}();

export function makeGames(state: IReviewState): GameUpload[] {
  let { rows, hasHeader, teams, locations } = state;
  if(hasHeader) [ , ...rows] = rows;

  // for each row
  const data = rows.map(row => {
    let item = {}
    // for each column
    state.columns.forEach((col, i) => {
      let key = col.property;
      switch (key) {
        case 'homeTeam':
        case 'awayTeam':
          item[key] = state.teamMaps.filter(map => map.key == row[i])[0];
          break;
        case 'location':
          item[key] = state.locationMaps.filter(map => map.key == row[i])[0];
          break;
        default:
          item[key] = row[i];
      }
    });
    return item;
  });
  // get mapped value
  const games = data.map((item: any) => {
    return {
      startsOn: item.date + ' ' + item.time,
      duration: item.duration,
      location: getLocation(locations, item.location.id),
      homeTeam: getTeam(teams, item.homeTeam.id),
      awayTeam: getTeam(teams, item.awayTeam.id),
      selected: true
    } as GameUpload;
  });

  return games

}

interface IReviewState extends IImportState {
  games?: GameUpload[],
  isProcessing?: boolean
}

export default class Review extends Component<{},IReviewState> {

  constructor() {
    super();
    this.state = Object.assign({}, storage.load());
    const { columns, rows, hasHeader } = this.state;
    this.state.games = makeGames(this.state);
  }

  handleGameToggle = (id: string) => () => {
    let games = Object.assign({}, this.state.games);
    this.setState({
      games: games.map(g => {
        if(g.id == id) { g.selected = !g.selected }
        return g;
      })
    })

  }

  handleCreateGames = () => {
    this.setState({ isProcessing: true });
    const { leagueId, seasonId, divisionId } = this.state;
    let payload = {
      game: this.state.games.map(g => {
        return {
          programId: leagueId,
          seasonId: seasonId,
          divisionId: divisionId,
          startsOn: g.startsOn,
          duration: g.duration,
          homeTeamId: g.homeTeam.id,
          awayTeamId: g.awayTeam.id,
          locationId: g.location.id
        }
      })
    }
    Store.createGames(payload).then(
      (response) => {
        alert('Games have been posted');
      },
      (error) => {
        alert(error);
        this.setState({ isProcessing: false });
      }
    )
  }

  render() {
    return (
      <div>
        <Header
          title="Review"
          canBack={true}
          backUrl="/games/import/mapping"
          canNext={false}
        />
        <table className="table table-bordered table-striped">
          <thead>
            <tr>
              <th></th>
              <th>Date / Time</th>
              <th>Location</th>
              <th>Home</th>
              <th>Away</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {this.state.games.map((g, i)=> (
              <tr key={i}>
                <td style={{textAlign: 'center'}}>
                  <input type="checkbox" checked={g.selected} onChange={this.handleGameToggle(g.id)}/>
                </td>
                <td>{moment(new Date(g['startsOn'])).format('ddd M/D/YY h:mma').replace('m','')}</td>
                <td>{g['location']['name']}</td>
                <td>{g['homeTeam']['name']}</td>
                <td>{g['awayTeam']['name']}</td>
                <td></td>
              </tr>
            ))}
          </tbody>
        </table>
        <button className="btn btn-primary" onClick={this.handleCreateGames}>Create Games</button>
        <p style={{height: 20}}> </p>
      </div>
    );
  }
}
