import React from 'react';

import CSSModules from 'react-css-modules';
import styles from './styles.css';
import Glyphicon from 'react-bootstrap/lib/Glyphicon';
import ReactDatasheet from 'react-datasheet';
import {decode} from '../Message/Message';
import SpreadsheetHeader from '../SpreadsheetHeader/SpreadsheetHeader';
import moment from 'moment'

export default class Spreadsheet extends React.Component {

  constructor (props) {
    super(props)

    this.state = {
      grid: this.generateBlankGrid(),
    };

    this.numMessages = 15;

    this.replyX = 3 + this.numMessages;
    this.replyY = 3;

    this.updateGrid = this.updateGrid.bind(this);
    this.onSelected = this.onSelected.bind(this);
  }

  // todo save stuff to localstorage and display it in grid
  generateBlankGrid() {
    let width = 10, height = 100;

    let headerRow = [{readOnly: true, value: ''}];

    for (let x = 0; x < width; x++) {
      headerRow.push({readOnly: true, value: String.fromCharCode('A'.charCodeAt(0) + x)});
    }

    let allRows = [headerRow];
    
    for (let y = 1; y < height; y++) {
      let thisRow = [{readOnly: true, value: y}];

      for (let x = 0; x < width; x++) {
        thisRow.push({value: ''});
      }

      allRows.push(thisRow);
    }

    return allRows;
  }


  componentWillReceiveProps(nextProps) {
    if (JSON.stringify(nextProps.messages) === JSON.stringify(this.props.messages))
      return;
    this.setState({
      grid: this.updateGrid(nextProps.messages),
    });

  }

  updateGrid(messages) {
    this.state.grid = this.generateBlankGrid();
    let numMessages = this.numMessages;

    let x, y = this.numMessages + 1;
    
    this.state.grid[1][3].value = "You";
    this.state.grid[1][2].value = this.props.user.username;
    this.state.grid[1][1].value = "Time";

    this.state.grid[this.replyX][this.replyY] = {
      value:  "Type reply...",
    }

    for (let i = messages.length - 1; i > messages.length - numMessages; i--) {
      if (!messages[i]) continue;
      if (messages[i].sentBy === localStorage.getItem('id')) {
        x = 3;
        this.state.grid[y][3].value = decode(messages[i].text);
        this.state.grid[y--][1].value = moment(messages[i].createdAt).format('h:mm a');
      } else {
        x = 2;
        this.state.grid[y][2].value = decode(messages[i].text);
        this.state.grid[y--][1].value = moment(messages[i].createdAt).format('h:mm a');
      }

    }

    return this.state.grid;
  }

  onSelected(selected) {
    console.error(selected)
    this.setState({ selected })
  }


  render () {
    let spreadsheet = <ReactDatasheet
          data={this.state.grid}
          valueRenderer={(cell) => cell.value}
          selected={this.state.selected}
          onSelect={this.onSelected}
          onContextMenu={(e, cell, i, j) => cell.readOnly ? e.preventDefault() : null}
          onCellsChanged={changes => {
            const grid = this.state.grid.map(row => [...row])

            changes.forEach(({cell, row, col, value}) => {
              if (
                row === this.replyX &&
                col === this.replyY &&
                grid[this.replyX][this.replyY].value !== value
              ) {
                this.props.sendMessage(value); 
                let selected = { start: { i: this.replyX, j: this.replyY}, end: { i: this.replyX, j: this.replyY } };
                setTimeout(() => this.setState({selected}), 0);
              }
              grid[row][col] = {value};

            })
            this.setState({grid}, () => {
              window.scrollTo(0, 0);
            })
          }}
        />
  

    return (
      <span>
      <SpreadsheetHeader />
      {spreadsheet}
      <span id="seen" />
      <span id="message-list" />
      </span>
    )
  }
}
