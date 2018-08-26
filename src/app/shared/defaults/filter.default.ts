import { Filter } from '../../models/filter';
export class FilterDefault {
    get getDefaultFilters(): Set<Filter> {
        return new Set (['trump', 'sanders']);
    }
}
