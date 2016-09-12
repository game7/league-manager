import * as React from 'react';
import { Component } from 'react';
import * as _ from 'lodash';
import { IImportState, Header, row, storage, Map, Column } from './common';
import { Store, League, Season, Division } from '../store';

export function makeColumns(row: row): Column[] {
  return row.map(col => {
    return {
      pattern: col
    }
  }) as Column[];
}

export default class Context extends Component<{},IImportState> {

  constructor() {
    super();
    this.state = Object.assign({}, storage.load());
  }

  componentDidMount() {
    Promise.all([
      Store.leagues(),
      Store.seasons(),
      Store.divisions(),
      Store.teams()
    ]).then(results => {
      this.setStateAndSave({
        leagues: results[0],
        seasons: results[1],
        divisions: results[2],
        teams: results[3]
      })
    })
  }

  get canMoveNext(): boolean {
    return !!this.state.seasonId && !!this.state.divisionId;
  }

  handleLeagueChange = (leagueId: string) => {
    this.setStateAndSave({
      leagueId: leagueId,
      seasonId: undefined,
      divisionId: undefined
    });
  }

  handleSeasonChange = (seasonId: string) => {
    this.setStateAndSave({ seasonId: seasonId });
  }

  handleDivisionChange = (divisionId: string) => {
    this.setStateAndSave({ divisionId: divisionId })
  }

  setStateAndSave = (state: IImportState) => {
    this.setState(state, () => {
      storage.save(this.state);
    })
  }

  handleColumnChange = (key: string) => (event: any) => {
    const value = event.target.value;
    const state = Object.assign({}, this.state);
    const columns = state.columns.map((column, i) => {
      if (column.pattern == key) {
        column.property = value;
      }
      return column;
    })
    this.setState({ columns: columns }, () => storage.save(this.state));
  }

  render() {
    return (
      <div>
        <Header
          title="Context"
          canBack={false}
          canNext={this.canMoveNext}
          nextUrl="/games/import/file"
        />
        <LeaguePicker
          leagues={this.state.leagues}
          leagueId={this.state.leagueId}
          onChange={this.handleLeagueChange}
        />
        <SeasonPicker
          seasons={this.state.seasons}
          leagueId={this.state.leagueId}
          seasonId={this.state.seasonId}
          onChange={this.handleSeasonChange}
        />
        <DivisionPicker
          divisions={this.state.divisions}
          leagueId={this.state.leagueId}
          divisionId={this.state.divisionId}
          onChange={this.handleDivisionChange}
        />
        <hr/>
      </div>
    );
  }
}

let LeaguePicker = (props: { leagues: League[], leagueId: string, onChange: (string) => void }) => {
  const { leagues = [], leagueId = '' } = props;
  return (
    <div className="form-group">
      <label htmlFor="league">League</label>
      <select
        id="league"
        className="form-control"
        value={leagueId}
        onChange={event => props.onChange(event.target['value'])}
      >
        <option value=""></option>
        {leagues.map((league, i) => (
          <option
            key={league.id}
            value={league.id}>
            {league.name}
          </option>
        ))}
      </select>
    </div>
  )
}

interface SeasonPickerProps {
  seasons: Season[];
  leagueId: string;
  seasonId: string;
  onChange: (string) => void;
}

let SeasonPicker = (props: SeasonPickerProps) => {
  let seasons = (props.seasons || []).filter((s) => s.programId == props.leagueId);
  return (
    <div className="form-group">
      <label htmlFor="season">Season</label>
      <select
        id="season"
        className="form-control"
        value={props.seasonId}
        onChange={event => props.onChange(event.target['value'])}
      >
        <option value=""></option>
        {seasons.map((s, i) => (
          <option
            key={s.id}
            value={s.id}>
            {s.name}
          </option>
        ))}
      </select>
    </div>
  )
}

interface DivisionPickerProps {
  divisions: Division[];
  leagueId: string;
  divisionId: string;
  onChange: (string) => void;
}

let DivisionPicker = (props: DivisionPickerProps) => {
  let divisions = (props.divisions || []).filter((s) => s.programId == props.leagueId);
  return (
    <div className="form-group">
      <label htmlFor="division">Division</label>
      <select
        id="division"
        className="form-control"
        value={props.divisionId}
        onChange={event => props.onChange(event.target['value'])}
      >
        <option value=""></option>
        {divisions.map((d, i) => (
          <option
            key={d.id}
            value={d.id}>
            {d.name}
          </option>
        ))}
      </select>
    </div>
  )
}
