import { Reducer } from 'react';

import { ISite } from './SitesContext';
import { removeItem, updateItem } from '../Utils';

export interface SitesState {
  sites?: ISite[];
  status: 'idle' | 'loading';
  error?: Error;
}

const SitesReducer: Reducer<Readonly<SitesState>, Action> = (state, action) => {
  switch (action.type) {
    case 'LOADING_REQUEST':
      return { ...state, status: 'loading' };
    case 'LOADING_SUCCESS':
      return { ...state, status: 'idle', sites: action.payload };
    case 'LOADING_FAILURE':
      return { ...state, status: 'idle', error: action.error };
    case 'SITE_ADD':
      return { ...state, sites: [...state.sites, action.site] };
    case 'SITE_UPDATE': {
      const sites = [...state.sites];
      const index = [...sites].findIndex(site => site.name === action.site.name);
      return { ...state, sites: updateItem(sites, index, action.newSite) };
    }
    case 'SITE_REMOVE': {
      const sites = [...state.sites];
      const index = [...sites].findIndex(site => site.name === action.site.name);
      return { ...state, sites: removeItem(sites, index) };
    }
    default:
      return state;
  }
};

type Action =
  | { type: 'SITE_ADD'; site: ISite }
  | { type: 'SITE_REMOVE'; site: ISite }
  | { type: 'SITE_UPDATE'; site: ISite; newSite: ISite }
  | { type: 'LOADING_REQUEST' }
  | { type: 'LOADING_SUCCESS'; payload: ISite[] }
  | { type: 'LOADING_FAILURE'; error?: Error };

export const SitesInitialState: SitesState = {
  sites: undefined,
  status: 'idle',
};

export default SitesReducer;
