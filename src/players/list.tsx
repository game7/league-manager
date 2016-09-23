import * as React from 'react';
import { Component } from 'react';
import { Link } from 'react-router';

export default () => {
  return(
    <div>
      <h1>List</h1>
      <Link to={`/players/import`}>Import</Link>
    </div>
  );
}
