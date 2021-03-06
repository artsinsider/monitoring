import React, { Component } from 'react'
import { Input, Icon, Button } from 'antd'
import { connect } from 'react-redux'
import { filterColumn } from '../../AC/resources'
import {searchWholeTable, resetSearch} from '../../AC/periodResources'
import {throttle, debounce } from 'throttle-debounce'
const Search = Input.Search

const styles = {
  searchbar: {
    minWidth: '400px',
    width: '100%',
    color: '#49a9ee',
    marginRight: 20
  }
}

class SearchFilter extends Component {
  constructor(props) {
    super(props)
    this.state = {
      value: ''
    }
    this.handleChange = debounce(500, this.handleChange)
  }
    /**  Сбрасываем значение инпута */
   clearValue = () => {
     this.input.input.refs.input.value = ''
     this.setState({value: ''})
     this.props.resetSearch()
   }

   handleChange = () => {
     const currentSearchValue = this.input.input.refs.input.value //ouch
     this.props.searchWholeTable(currentSearchValue.toLowerCase())
     this.setState({ value: currentSearchValue })
   }

  render() {
    return (
      <div className="search-line" >
          { this.state.value
            ? <Button onClick={this.clearValue} type="primary">
                <Icon type="close" />
              </Button>
            : null}
         <Search  ref={(input) => this.input = input}
                  placeholder="Глобальный поиск по таблице ресурсов"
                  style={styles.searchbar}
                  onChange={e => this.handleChange(e)}
         />
      </div>
    )
  }
}

export default connect(null, { filterColumn, searchWholeTable, resetSearch })(SearchFilter)