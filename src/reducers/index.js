import { combineReducers } from 'redux'
import sections          from './sections_test'
import units             from './units'
import states            from './states'
import resourceTypes     from './resourceTypes'
import resources         from './resources'
import periods           from './periods'
import reports           from './reports'
import interfaceAction   from './interfaceAction'
import periodResources   from './periodResources'
import administration    from './administration'
import user              from './user'

export default combineReducers({
  sections,
  units,
  states,
  resourceTypes,
  resources,
  periods,
  periodResources,
  administration,
  reports,
  interfaceAction,
  user
})
