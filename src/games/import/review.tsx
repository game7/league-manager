import * as React from 'react';
import { Component } from 'react';
import * as _ from 'lodash';
import { IImportState, Header, row, storage, Map, Column, Properties } from './common';
import { Store, Team, Location, Game } from '../store';
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

export function makeGames(state: IReviewState): Game[] {
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
  console.log('data', data);
  // get mapped value
  const games = data.map((item: any) => {
    return {
      startsOn: item.date + ' ' + item.time,
      duration: item.duration,
      location: getLocation(locations, item.location.id),
      homeTeam: getTeam(teams, item.homeTeam.id),
      awayTeam: getTeam(teams, item.awayTeam.id)
    } as Game;
  });

  console.log('games', games);

  return games

}

interface IReviewState extends IImportState {
  games?: Game[]
}

export default class Review extends Component<{},IReviewState> {

  constructor() {
    super();
    this.state = Object.assign({}, storage.load());
    const { columns, rows, hasHeader } = this.state;
    this.state.games = makeGames(this.state);
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
              <th>Date / Time</th>
              <th>Location</th>
              <th>Home</th>
              <th>Away</th>
            </tr>
          </thead>
          <tbody>
            {this.state.games.map((g, i)=> (
              <tr key={i}>
                <td>{moment(new Date(g['startsOn'])).format('ddd M/D/YY h:mma').replace('m','')}</td>
                <td>{g['location']['name']}</td>
                <td>{g['homeTeam']['name']}</td>
                <td>{g['awayTeam']['name']}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
}
