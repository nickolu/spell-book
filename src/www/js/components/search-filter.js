var React = require('react');
var ReactDOM = require('react-dom');

import { TextInput } from '../../../../node_modules/simple-react-forms/form-fields/text-input.js';
import { CheckBoxGroup } from '../../../../node_modules/simple-react-forms/form-fields/checkbox-group.js';
import { ShowHideButton } from './show-hide-button.js';

export class SearchFilter extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      searchFor : ['name']
    }

    this.filter = this.filter.bind(this);
    this.setPropertySearch = this.setPropertySearch.bind(this);
    
  };

  filter() {
      var name = document.querySelector('[name=search_spells]').value;
      var filters = this.props.context.state.filter || [];
      var props = this.state.searchFor;
      var newFilters = [];
      var descriptionSearch = this.props.context.state.descriptionSearch;

      props.forEach(function(key){
        var hasFilter = false;
        
        filters.forEach(function(obj){
          if (obj.key === key && obj.type === "search") {
            hasFilter = true;
            obj.value = name;
          }
        });

        if (!hasFilter) {
          filters.push({
            "key" : key,
            "type" : "search",
            "value" : name,
            "usePartialMatch" : true
          });  
        }
        
      });

      this.props.context.setState({
        spells: this.props.context.state.spells,
        filter : filters,
        descriptionSearch : descriptionSearch
      });

      this.props.onUpdate();
  }

  setPropertySearch(e) {
      var isChecked = false;
      var searchFor = this.state.searchFor;
      var filters = this.props.context.state.filter || [];
      var key = e.target.getAttribute('data-id');
      var i = 0;

      if (e.target.checked) {
        searchFor.push(key);
      } else {
        searchFor.splice(searchFor.indexOf(key),1);
        filters.forEach(function(filter){
          if (filter.key === key && filter.type === "search") {
            filters.splice(i,1);
          }
          i++;
        }); 
      }

      this.setState({
        searchFor : searchFor
      });
      console.log(this.state);
      this.filter();
  } 
  

  render() {

    return  <div>
              <TextInput type="text" label="Search" name="search_spells" onChange={this.filter} />
              <ShowHideButton target={".advanced-search"} showText="+" hideText="-" startClosed="true"/><span>Advanced Search</span>
              <CheckBoxGroup cssClass="advanced-search height-zero" name="search_for_props" label="choices" choices={this.props.searchForChoices} groupLabel="Search In" groupName="search_for_props" onUpdate={this.setPropertySearch} />
            </div>
  }
}
