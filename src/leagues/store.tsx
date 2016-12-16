import * as React from 'react';

export interface Tenant {
  id: string;
  name: string;
  url: string;
}

export interface League {
  id: string;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface Season {
  id: string;
  programId: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface Division {
  id: string;
  programId: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface Team {
  id: string
  seasonId: string
  divisionId: string
  name: string
  shortName: string
}

export interface Location {
  id: string
  name: string
  shortName: string
}

export interface GameUpload {
  id: string;
  startsOn: string;
  duration: string;
  homeTeam: Team;
  awayTeam: Team;
  location: Location;
  selected: boolean;
  processing: boolean;
  completed: boolean;
}

const unwrap = (response: Response) => response.json();

export class Store {

  static tenants() {
    return fetch(process.env.API_BASE + '/api/league/tenants')
      .then(response => response.json())
      .then(data => data['tenants'] as Tenant[]);
  }

  static leagues(): Promise<League[]> {
    return fetch(process.env.API_BASE + '/api/league/programs')
      .then(response => response.json())
      .then(data => data['leagues'] as Promise<League[]>);
  }

  static seasons() {
    return fetch(process.env.API_BASE + '/api/league/seasons')
      .then(unwrap)
      .then(data => data['seasons'] as Season[]);
  }

  static divisions() {
    return fetch(process.env.API_BASE + '/api/league/divisions')
      .then(unwrap)
      .then(data => data['divisions'] as Division[]);
  }

  static teams() {
    return fetch(process.env.API_BASE + '/api/league/teams')
      .then(unwrap)
      .then(data => data['teams'] as Team[]);
  }

  static locations() {
    return fetch(process.env.API_BASE + '/api/locations')
      .then(unwrap)
      .then(data => data['locations'] as Location[]);
  }

  static createGames(games: any) {
    return fetch(process.env.API_BASE + '/api/league/games/batch_create', {
      method: 'POST',
      body: JSON.stringify(games),
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }

}
