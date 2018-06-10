import React from 'react';

import CSSModules from 'react-css-modules';
import styles from './styles.css';
import Glyphicon from 'react-bootstrap/lib/Glyphicon';
import ReactDatasheet from 'react-datasheet';
import {decode} from '../Message/Message';
import SpreadsheetHeader from '../SpreadsheetHeader/SpreadsheetHeader';
import moment from 'moment'
import {isDelivered, isSeen} from '../../messageUtils';

export default class Spreadsheet extends React.Component {

  constructor (props) {
    super(props)

    this.state = {
      grid: this.generateBlankGrid(),
    };

    this.numMessages = 15;

    this.replyY = 3 + this.numMessages;
    this.replyX = 4;

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
    this.setState({
      grid: this.updateGrid(nextProps.messages),
    });

  }

  updateGrid(messages) {
    this.state.grid = this.generateBlankGrid();
    let numMessages = this.numMessages;

    let x, y = this.numMessages + 1;
    
    this.state.grid[1][this.replyX].value = "You";
    this.state.grid[1][this.replyX - 1].value = this.props.user.username;
    this.state.grid[1][this.replyX - 2].value = "Status";
    this.state.grid[1][this.replyX - 3].value = "Time";

    this.state.grid[this.replyY][this.replyX] = {
      value:  "Type reply...",
    }

    for (let i = messages.length - 1; i > messages.length - numMessages; i--) {
      if (!messages[i]) continue;
      if (messages[i].sentBy === localStorage.getItem('id')) {
        this.state.grid[y][this.replyX].value = decode(messages[i].text);
      } else {
        this.state.grid[y][this.replyX - 1].value = decode(messages[i].text);
      }

      this.state.grid[y][this.replyX - 3].value = moment(messages[i].createdAt).format('h:mm a');
      this.state.grid[y][this.replyX - 2].value = this.getStatus(messages[i]);
      y--;

    }

    return this.state.grid;
  }

  getStatus(message) {
    // If we didn't send it, but we're seeing it, it's always seen
    // Isn't it? Maybe not in group chats
    if (message.sentBy !== localStorage.getItem('id')) {
      // return "Seen";
    }

    if (isSeen(message)) {
      return "Seen";
    } else if (isDelivered(message)) {
      return "Delivered";
    } else if (message.fake) {
      return "Pending";
    } else {
      return "Sent";
    }
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
                row === this.replyY &&
                col === this.replyX &&
                grid[this.replyY][this.replyX].value !== value
              ) {
                this.props.sendMessage(value); 
                let selected = { start: { i: this.replyY, j: this.replyX}, end: { i: this.replyY, j: this.replyX } };
                setTimeout(() => this.setState({selected}), 0);
              }
              grid[row][col] = {value};

            })
            this.setState({grid}, () => {
              window.scrollTo(0, 0);
            });
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