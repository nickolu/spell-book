var React = require('react');
var ReactDOM = require('react-dom');
var utilities = require("../../../node_modules/simple-react-utilities/js/utilities.js");

import config from '../json/config.json';
import spellData from '../json/spells.json';
import { ShowHideButton } from './components/show-hide-button.js';
import { SearchFilter } from './components/search-filter.js';
import { CardSizeButton } from './components/card-size-button.js';
import { FilterButton } from './components/filter-button.js';
import { FilterButtonGroup } from './components/filter-button-group.js';
import { FilterSet } from './components/filter-set.js';



//TODO: when making multiple selections in school or level, should add to total cards
//TODO: allow filtering via query string
//TODO: make controls fixed and hideable
//TODO: update sortSpellsByProp to work with props other than name (need to create utilities.getObjectByProp() method)
//TODO: add spell sorting to the UI

class SpellBook extends React.Component {
  /**
   * constructor for SpellBook
   * @param  {object} props [element properties/attributes passed in at initialization]
   */
  constructor(props) {
    super(props);

    var sortedSpellData = utilities.sortObjectsByProp(spellData, "name");

    this.state = {
      spells : sortedSpellData,
      sortSpells : "name",
      descriptionSearch : false,
      filter : []
    };

    this.setExclusiveFilters = this.setExclusiveFilters.bind(this);
    this.setInclusiveFilters = this.setInclusiveFilters.bind(this);
  }

  getQueryVariable(variable) {
       var query = window.location.search.substring(1);
       var vars = query.split("&");
       for (var i=0;i<vars.length;i++) {
               var pair = vars[i].split("=");
               if(pair[0] == variable){return pair[1];}
       }
       return(false);
  }

  getFiltersFromQueryString() {
    var filter = {};

    filter = {
      key:"name",
      type:"search",
      usePartialMatch:true,
      value:decodeURIComponent(this.getQueryVariable('search'))
    }

    return filter;
  }


  /**
   * gets the filtered spells using list of filters in state.filters
   * OVERRIDES the array each time to have ONLY items that match ALL filters
   * @param  {object} e [event object passed by event listener]
   */
  setExclusiveFilters() {
    var _this = this;
    var sortedSpellData = utilities.sortObjectsByProp(spellData, "name");

    this.state.filter.forEach(function(obj) {
      sortedSpellData = _this.getFilteredSpells(sortedSpellData, obj)
    });

    this.setState({
      spells : sortedSpellData,
      filter : _this.state.filter
    });

  }

  /**
   * gets the filtered spells using list of filters in state.filters
   * CONCATENATES the array each time to have ALL items that match ANY filters
   * @param  {object} e [event object passed by event listener]
   */
  setInclusiveFilters() {
    var _this = this;
    var filteredSpells = [];

    this.state.filter.forEach(function(obj) {
      filteredSpells = filteredSpells.concat(_this.getFilteredSpells(spellData, obj));
      filteredSpells = utilities.arrayUnique(filteredSpells);
    });

    _this.setState({
      spells : utilities.sortObjectsByProp(filteredSpells, "name"),
      filter : _this.state.filter
    });
  }

  /**
   * gets a list of spells filtered by a key and value
   * @param  {array} spells    [array of spells to filter]
   * @param  {object} options   [object of options]
   * @return {array}  [array of spell objects, with filtered items removed]
   */
  getFilteredSpells(spells, filter) {
    var usePartialMatch = filter.usePartialMatch || false;
    var key = filter.key || "";
    var val = filter.value || "";
    var spellProp, spellSubProp;
    var filteredSpells = [];

    console.log(this.state.filter);
    /**
     * checks if a string exists in another string
     * @param  {string} str1 [string to search]
     * @param  {string} str2 [string to find in str1]
     * @return {boolean}     [whether str2 is found is str1]
     */
    function checkPartialMatch(str1,str2) {
      if (str2) {
        str2 = str2.replace(/_/g, ' ');
      }
      
      return usePartialMatch && str1.toLowerCase().indexOf(str2.toLowerCase()) > -1;
    }

    function checkFirstCharMatch(str, char) {
      var strArr = str.split("");

      if (strArr[0].toLowerCase() === char.toLowerCase()) {
        return true;
      }
      return false;
    }

    /**
     * iterate through all properties of all spells
     * push any spell with a match to the filtered spells array
     */
    for (var i = 0, l = spells.length; i < l; i+=1) {
      if (filter.type && filter.type === "alphabet" && checkFirstCharMatch(spells[i].name, val)) {
        filteredSpells.push(spells[i]);
      } else {
        for (spellProp in spells[i]) {
          if (spells[i][key] === val || checkPartialMatch(spells[i][key],val)) {
            filteredSpells.push(spells[i]);
            break;
          } else if (typeof spells[i][spellProp] === "object") {
          /**
           * look through sub objects (like classes) for matches
           */
            for (spellSubProp in spells[i][spellProp]) {
              if (spellSubProp === val || checkPartialMatch(spellSubProp,val)) {
                filteredSpells.push(spells[i]);
                break;
              }
            }
          }
        }
      }
    }

    return filteredSpells;
  }


  /**
   * renders the list of spells
   */
  renderSpells() {
    var i = 0;
    var spells = <div className="spell-card-container row">{this.state.spells.map(spell => <div key={spell.name} className="spell-card col-xs-12 col-sm-6 col-md-4"> 
                     <div className="spell-card-inner">
                        <h2 className="spell_name">{spell.name}</h2>
                        <span className="open-button"><ShowHideButton target={".row"+".spell"+i} showText="+" hideText="-" /></span>
                        <span className="closed-button"><ShowHideButton target={".row"+".spell"+i} showText="+" hideText="-" startClosed="true"/></span>
                        <div className={"row spell-card-content " + "spell"+i++}>
                          <div className="col-xs-6">
                            <p className="spell-card-property spell_level"><strong>Level:</strong> {spell.level}</p>
                            <p className="spell-card-property spell_casting_time"><strong>Casting Time:</strong> {spell.casting_time}</p>
                            <p className="spell-card-property spell_duration"><strong>Duration:</strong> {spell.duration}</p>
                            <p className="spell-card-property spell_range"><strong>Range:</strong> {spell.range}</p>
                            <p className="spell-card-property spell_components"><strong>Components:</strong> {spell.components}</p>
                          </div>
                          <div className="col-xs-6">
                            <p className="spell-card-property spell_concentration"><strong>Concentration:</strong> {spell.concentration}</p>
                            <p className="spell-card-property spell_ritual"><strong>Ritual:</strong> {spell.ritual}</p>
                            <p className="spell-card-property spell_page"><strong>Page:</strong> {spell.page}</p>
                            <p className="spell-card-property spell_school"><strong>School:</strong> {spell.school}</p>
                            <p className="spell-card-property spell_class"><strong>Class:</strong> {utilities.getArrayFromObject(spell,'class',true)}</p>
                          </div>
                          <div className="col-xs-12">
                            <hr />
                            <p className="spell_description" dangerouslySetInnerHTML={ { __html: spell.description } }></p>
                          </div>  
                        </div>
                      </div>
                   </div>
              )}</div>;


    if (this.state.spells.length === 0) {
      spells = <div className="spell-card-container"><h4 className="no-spells">No spells matching the selected filters</h4></div>
    }

    return spells;
  }


  componentDidMount () {
    function updatefromQuery() {
      var sortedSpellData = utilities.sortObjectsByProp(spellData, "name");


      this.state = {
        spells : sortedSpellData,
        sortSpells : "name",
        descriptionSearch : false,
        filter : [this.getFiltersFromQueryString()]
      };
      this.setExclusiveFilters();
      this.setInclusiveFilters();
    }
    

    if (this.getQueryVariable('search')) {
      this.forceUpdate(updatefromQuery);  
    }
  }

  /**
   * puts everything in the DOM
   */
	render() {
    var filterOptions = config;

    return  <div className="container">
              <div className="row">
                <div className="col-sm-12">
                  <h2>Spells ({this.state.spells.length})</h2>

                  <div className="card-size-controls">
                    <h4 className="card-size-controls-title">Card Size</h4>
                    <CardSizeButton onUpdate={this.setExclusiveFilters} />
                  </div>

                  <p>Filters: <ShowHideButton target=".filters-wrapper" showText="+" hideText="-" /></p>

                  <div className="row filters-wrapper">
                    <div className="col-xs-12 col-sm-6 col-md-3">
                      <SearchFilter 
                        onUpdate={this.setInclusiveFilters} 
                        context={this} 
                        searchForChoices={filterOptions.search.choices}
                      />
                      <FilterSet 
                        id="page" 
                        label="Source" 
                        filterOptions={filterOptions.page} 
                        onUpdate={this.setExclusiveFilters} 
                        data={spellData} 
                        context={this} 
                      />
                    </div>

                    <div className="col-xs-12 col-sm-6 col-md-3">
                      <FilterSet 
                        id="components" 
                        label="components" 
                        filterOptions={filterOptions.components} 
                        onUpdate={this.setExclusiveFilters} 
                        data={spellData} 
                        context={this} 
                      />
                    
                      <h5>Options</h5><ShowHideButton target='.filter-options' showText='+' hideText='-' />

                      <div className="filter-options">
                        <FilterButton 
                          prop="concentration" 
                          val="yes" 
                          label="Concentration" 
                          onUpdate={this.setExclusiveFilters} 
                          context={this} 
                          data={spellData} 
                        />
                        <FilterButton 
                          prop="concentration" 
                          val="no" 
                          label="Not Concentration" 
                          onUpdate={this.setExclusiveFilters} 
                          context={this} 
                          data={spellData} 
                        />
                        <FilterButton 
                          prop="ritual" 
                          val="yes" 
                          label="Ritual" 
                          onUpdate={this.setExclusiveFilters} 
                          context={this} 
                          data={spellData} 
                        />
                        <FilterButton 
                          prop="ritual" 
                          val="yes" 
                          label="Not Ritual" 
                          onUpdate={this.setExclusiveFilters} 
                          context={this} 
                          data={spellData} 
                        />



                      </div>

                    </div>

                    <FilterSet id="casting_time" 
                      cssClass="col-xs-12 col-sm-6 col-md-3" 
                      label="Casting Time" 
                      filterOptions={filterOptions.casting_time} 
                      onUpdate={this.setExclusiveFilters} 
                      data={spellData} 
                      context={this} 
                    />
                    <FilterSet id="school" 
                      cssClass="col-xs-12 col-sm-6 col-md-3" 
                      label="School" 
                      filterOptions={filterOptions.school} 
                      onUpdate={this.setExclusiveFilters} 
                      data={spellData} 
                      context={this}
                    />
                    <FilterSet id="class" 
                      cssClass="col-xs-12 col-sm-6" 
                      label="Class" 
                      filterOptions={filterOptions.class} 
                      onUpdate={this.setExclusiveFilters} 
                      data={spellData} 
                      context={this}
                    />
                    <FilterSet id="level" 
                      cssClass="col-xs-12 col-sm-6" 
                      label="Level" 
                      filterOptions={filterOptions.level} 
                      onUpdate={this.setExclusiveFilters} 
                      data={spellData} 
                      context={this}
                    />
                    <FilterSet id="name" 
                      cssClass="col-xs-12" 
                      label="Filter Alphabetically" 
                      filterOptions={filterOptions.name} 
                      onUpdate={this.setExclusiveFilters} 
                      data={spellData} 
                      context={this}
                    />
                        
                  </div>

                  {this.renderSpells()}

                </div>
              </div>
      		  </div>;
	}
}

ReactDOM.render(<SpellBook/>, document.querySelector('main'));
