var React = require('react');
var ReactDOM = require('react-dom');
var utilities = require("../../../../node_modules/simple-react-utilities/js/utilities.js");

import { ShowHideButton } from './show-hide-button.js';
import { FilterButtonGroup } from './filter-button-group.js';

/**
 * renders a group of buttons which filter the spells by a key and list of options
 * @param  {string}   key           the value for the spell filter key ("class","level","school", etc)
 * @param  {array}    choices       list of options for the provided key
 * @param  {boolean}  multiSelect   whether to allow multiple options to be selected at one time
 * @return {ButtonGroup}            <ButtonGroup /> element to render
 */
export class FilterSet extends React.Component {
  constructor(props) {
    super(props);
  };

  render() {
    var filterClass = 'filter-'+this.props.id;
    var targetFilter = '.'+filterClass;
    var type = this.props.filterOptions.type || '';
    var usePartialMatch = this.props.filterOptions.usePartialMatch || false;
    var multiSelect = this.props.filterOptions.multiSelect || false;

    return <div className={this.props.cssClass}>
              <h5>{this.props.label}</h5><ShowHideButton target={targetFilter} showText="+" hideText="-" />
              <div className={filterClass}>
                <FilterButtonGroup 
                  prop={this.props.id} 
                  choices={this.props.filterOptions.choices} 
                  multiSelect={multiSelect} 
                  type={type} 
                  usePartialMatch={usePartialMatch} 
                  onUpdate={this.props.onUpdate}
                  data={this.props.data} 
                  context={this.props.context} 
                />
              </div>
           </div>
  }
}
