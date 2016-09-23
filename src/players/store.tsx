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

export interface PlayerUpload {
  firstName: string;
  lastName: string;
  team: Team;
  jerseyNumber: string;
  email: string;
  birthdate: string;
  substitute: boolean;
  position: string;
}

export class Store {

  static tenants(): Promise<League[]> {
    return fetch(process.env.API_BASE + '/api/league/tenants')
      .then(response => {
        return response.json().then(data => data['tenants'] as Promise<Tenant[]>);
      });
  }

  static leagues(): Promise<League[]> {
    return fetch(process.env.API_BASE + '/api/league/programs')
      .then(response => {
        return response.json().then(data => data['leagues'] as Promise<League[]>);
      });
  }

  static seasons(): Promise<Season[]> {
    return fetch(process.env.API_BASE + '/api/league/seasons')
      .then(response => {
        return response.json().then(data => data['seasons'] as Promise<Season[]>);
      });
  }

  static divisions(): Promise<Division[]> {
    return fetch(process.env.API_BASE + '/api/league/divisions')
      .then(response => {
        return response.json().then(data => data['divisions'] as Promise<Division[]>);
      });
  }

  static teams(): Promise<Team[]> {
    return fetch(process.env.API_BASE + '/api/league/teams')
      .then(response => {
        return response.json().then(data => data['teams'] as Promise<Division[]>);
      });
  }

  static createPlayers(players: any): Promise<any[]> {
    return fetch(process.env.API_BASE + '/api/league/players/batch_create', {
      method: 'POST',
      body: JSON.stringify(players),
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }

}
