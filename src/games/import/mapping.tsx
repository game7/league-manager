import * as React from 'react';
import { Component } from 'react';
import * as _ from 'lodash';
import { IImportState, Header, row, storage, Map, Column } from './common';
import { Store, Team, Location } from '../store';


export function makeTeamMaps(columns: Column[], rows: row[], hasHeader: boolean): Map[] {
  if(hasHeader) [ , ...rows] = rows;
  const positions = [
    columns.findIndex(col => col.property == 'homeTeam'),
    columns.findIndex(col => col.property == 'awayTeam')
  ];
  const all = rows.map(row => positions.map(p => row[p])).reduce((prev, curr) => prev.concat(curr));
  const uniq = _.uniq(all) as string[];
  const maps = uniq.map(item => ({ key: item }));
  return maps;
}

export function findTeams(maps: Map[], teams: Team[]) : Map[] {
  return maps.map(map => {
    let team = teams.filter(t => t.name.toLowerCase().indexOf(map.key.toLowerCase()) != -1)[0] || ({} as Team);
    return {
      key: map.key,
      id: team.id,
      name: team.name
    } as Map;
  });
}

export function makeLocationMaps(columns: Column[], rows: row[], hasHeader: boolean): Map[] {
  if(hasHeader) [ , ...rows] = rows;
  const index = columns.findIndex(col => col.property == 'location');
  const all = rows.map(row => row[index]);
  const uniq = _.uniq(all) as string[];
  const maps = uniq.map(item => ({ key: item }));
  return maps;
}

export default class Mapping extends Component<{},IImportState> {

  constructor() {
    super();
    this.state = Object.assign({}, storage.load());
    const { columns, rows, hasHeader } = this.state;
    if(!this.state.teamMaps) {
      this.state.teamMaps = findTeams(makeTeamMaps(columns, rows, hasHeader), this.state.teams.filter(t => t.seasonId == this.state.seasonId && t.divisionId == this.state.divisionId));
    }
    if(!this.state.locationMaps) {
      this.state.locationMaps = makeLocationMaps(columns, rows, hasHeader);
    }
  }

  componentDidMount() {
    Promise.all([
      Store.teams(),
      Store.locations()
    ]).then(results => {
      this.setStateAndSave({
        teams: results[0],
        locations: results[1]
      });
    });
  }

  get canMoveNext(): boolean {
    const { teamMaps, locationMaps} = this.state;
    const maps = [...teamMaps, ...locationMaps];
    return maps.every(map => map.id && map.id != '');
  }

  setStateAndSave = (state: IImportState) => {
    this.setState(state, () => {
      storage.save(this.state);
    })
  }

  handleTeamMapChange = (key: string) => (event: any) => {
    const id = event.target.value;
    const { name } = this.state.teams.filter(t => t.id == id)[0]
    const maps = (Object.assign([], this.state.teamMaps) as Map[]).map(map => {
      if(map.key == key) {
        map.id = id;
        map.name = name;
      }
      return map;
    });
    this.setState({ teamMaps: maps }, () => storage.save(this.state));
  }

  handleLocationMapChange = (key: string) => (event: any) => {
    const id = event.target.value;
    const { name } = this.state.locations.filter(l => l.id == id)[0]
    const maps = (Object.assign([], this.state.locationMaps) as Map[]).map(map => {
      if(map.key == key) {
        map.id = id; 
        map.name = name;
      }
      return map;
    });
    this.setState({ locationMaps: maps }, () => storage.save(this.state));
  }

  get teams(): Team[] {
    const { teams, seasonId, divisionId } = Object.assign({}, this.state);
    return teams.filter((team) => {
      return team.seasonId == seasonId && team.divisionId == divisionId;
    });
  }

  render() {
    return (
      <div>
        <Header
          title="Mapping"
          canBack={true}
          backUrl="/games/import/columns"
          canNext={this.canMoveNext}
          nextUrl="/games/import/review"
        />
        <div className="row">
          <div className="col-sm-6">
            <h3>Locations</h3>
            <Maps
              maps={this.state.locationMaps}
              options={this.state.locations}
              onChange={this.handleLocationMapChange}/>
          </div>
          <div className="col-sm-6">
            <h3>Teams</h3>
            <Maps
              maps={this.state.teamMaps}
              options={this.teams}
              onChange={this.handleTeamMapChange} />
          </div>
        </div>
      </div>
    );
  }
}

type OnMapChange = (key: string) => (event: any) => void;

interface MapsProps {
  maps: Map[];
  options: any[];
  onChange: OnMapChange
}

const Maps = (props: MapsProps) => {
  const {
    maps = [],
    options = [],
    onChange
  } = props;
  return (
    <table className="table table-bordered">
      <tbody>
        {maps.map((map: Map)=> (
          <tr key={map.key}>
            <td style={{width: '50%'}}>{map.key}</td>
            <td style={{width: '50%'}}>
              <select className="form-control"
                value={map.id}
                onChange={onChange(map.key)}>
                <option value=""></option>
                {options.map(opt => (
                  <option key={opt.id} value={opt.id}>{opt.name}</option>
                ))}
              </select>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
