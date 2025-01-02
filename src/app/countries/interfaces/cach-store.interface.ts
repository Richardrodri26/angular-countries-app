import { Country } from "./country";
import type { Region } from "./region.type";


export interface CachStore {
  byCapital : TermCountries,
  byCountries: TermCountries,
  byRegion: RegionCountries
}

export interface TermCountries {
  term: string;
  countries: Country[]
}
export interface RegionCountries {
  region: Region;
  countries: Country[]
}
