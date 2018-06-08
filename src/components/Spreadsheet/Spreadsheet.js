import React from 'react';

import CSSModules from 'react-css-modules';
import styles from './styles.css';
import Glyphicon from 'react-bootstrap/lib/Glyphicon';
import ReactDatasheet from 'react-datasheet';

export default class Spreadsheet extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      grid: [
        [
          {readOnly: true, value: ''},
          {value: 'A', readOnly: true},
          {value: 'B', readOnly: true},
          {value: 'C', readOnly: true},
          {value: 'D', readOnly: true},
                    {value: 'A', readOnly: true},
          {value: 'B', readOnly: true},
          {value: 'C', readOnly: true},
          {value: 'D', readOnly: true},
                    {value: 'A', readOnly: true},
          {value: 'B', readOnly: true},
          {value: 'C', readOnly: true},
          {value: 'D', readOnly: true},

        ],
        [{readOnly: true, value: 1}, {value: 1}, {value: 3}, {value: 3}, {value: 3}, {readOnly: true, value: 1}, {value: 1}, {value: 3}, {value: 3}, {value: 3}, {readOnly: true, value: 1}, {value: 1}, {value: 3}, {value: 3}, {value: 3}],
        [{readOnly: true, value: 1}, {value: 1}, {value: 3}, {value: 3}, {value: 3}, {readOnly: true, value: 1}, {value: 1}, {value: 3}, {value: 3}, {value: 3}, {readOnly: true, value: 1}, {value: 1}, {value: 3}, {value: 3}, {value: 3}],
        [{readOnly: true, value: 1}, {value: 1}, {value: 3}, {value: 3}, {value: 3}, {readOnly: true, value: 1}, {value: 1}, {value: 3}, {value: 3}, {value: 3}, {readOnly: true, value: 1}, {value: 1}, {value: 3}, {value: 3}, {value: 3}],
        [{readOnly: true, value: 1}, {value: 1}, {value: 3}, {value: 3}, {value: 3}, {readOnly: true, value: 1}, {value: 1}, {value: 3}, {value: 3}, {value: 3}, {readOnly: true, value: 1}, {value: 1}, {value: 3}, {value: 3}, {value: 3}],
        [{readOnly: true, value: 1}, {value: 1}, {value: 3}, {value: 3}, {value: 3}, {readOnly: true, value: 1}, {value: 1}, {value: 3}, {value: 3}, {value: 3}, {readOnly: true, value: 1}, {value: 1}, {value: 3}, {value: 3}, {value: 3}],
        [{readOnly: true, value: 1}, {value: 1}, {value: 3}, {value: 3}, {value: 3}, {readOnly: true, value: 1}, {value: 1}, {value: 3}, {value: 3}, {value: 3}, {readOnly: true, value: 1}, {value: 1}, {value: 3}, {value: 3}, {value: 3}],
        [{readOnly: true, value: 1}, {value: 1}, {value: 3}, {value: 3}, {value: 3}, {readOnly: true, value: 1}, {value: 1}, {value: 3}, {value: 3}, {value: 3}, {readOnly: true, value: 1}, {value: 1}, {value: 3}, {value: 3}, {value: 3}],
        [{readOnly: true, value: 1}, {value: 1}, {value: 3}, {value: 3}, {value: 3}, {readOnly: true, value: 1}, {value: 1}, {value: 3}, {value: 3}, {value: 3}, {readOnly: true, value: 1}, {value: 1}, {value: 3}, {value: 3}, {value: 3}],
        [{readOnly: true, value: 1}, {value: 1}, {value: 3}, {value: 3}, {value: 3}, {readOnly: true, value: 1}, {value: 1}, {value: 3}, {value: 3}, {value: 3}, {readOnly: true, value: 1}, {value: 1}, {value: 3}, {value: 3}, {value: 3}],
        [{readOnly: true, value: 1}, {value: 1}, {value: 3}, {value: 3}, {value: 3}, {readOnly: true, value: 1}, {value: 1}, {value: 3}, {value: 3}, {value: 3}, {readOnly: true, value: 1}, {value: 1}, {value: 3}, {value: 3}, {value: 3}],
        [{readOnly: true, value: 1}, {value: 1}, {value: 3}, {value: 3}, {value: 3}, {readOnly: true, value: 1}, {value: 1}, {value: 3}, {value: 3}, {value: 3}, {readOnly: true, value: 1}, {value: 1}, {value: 3}, {value: 3}, {value: 3}],
        [{readOnly: true, value: 1}, {value: 1}, {value: 3}, {value: 3}, {value: 3}, {readOnly: true, value: 1}, {value: 1}, {value: 3}, {value: 3}, {value: 3}, {readOnly: true, value: 1}, {value: 1}, {value: 3}, {value: 3}, {value: 3}],
        [{readOnly: true, value: 1}, {value: 1}, {value: 3}, {value: 3}, {value: 3}, {readOnly: true, value: 1}, {value: 1}, {value: 3}, {value: 3}, {value: 3}, {readOnly: true, value: 1}, {value: 1}, {value: 3}, {value: 3}, {value: 3}],
        [{readOnly: true, value: 1}, {value: 1}, {value: 3}, {value: 3}, {value: 3}, {readOnly: true, value: 1}, {value: 1}, {value: 3}, {value: 3}, {value: 3}, {readOnly: true, value: 1}, {value: 1}, {value: 3}, {value: 3}, {value: 3}],
        [{readOnly: true, value: 1}, {value: 1}, {value: 3}, {value: 3}, {value: 3}, {readOnly: true, value: 1}, {value: 1}, {value: 3}, {value: 3}, {value: 3}, {readOnly: true, value: 1}, {value: 1}, {value: 3}, {value: 3}, {value: 3}],
        [{readOnly: true, value: 1}, {value: 1}, {value: 3}, {value: 3}, {value: 3}, {readOnly: true, value: 1}, {value: 1}, {value: 3}, {value: 3}, {value: 3}, {readOnly: true, value: 1}, {value: 1}, {value: 3}, {value: 3}, {value: 3}],
        [{readOnly: true, value: 1}, {value: 1}, {value: 3}, {value: 3}, {value: 3}, {readOnly: true, value: 1}, {value: 1}, {value: 3}, {value: 3}, {value: 3}, {readOnly: true, value: 1}, {value: 1}, {value: 3}, {value: 3}, {value: 3}],
        [{readOnly: true, value: 1}, {value: 1}, {value: 3}, {value: 3}, {value: 3}, {readOnly: true, value: 1}, {value: 1}, {value: 3}, {value: 3}, {value: 3}, {readOnly: true, value: 1}, {value: 1}, {value: 3}, {value: 3}, {value: 3}],
        [{readOnly: true, value: 1}, {value: 1}, {value: 3}, {value: 3}, {value: 3}, {readOnly: true, value: 1}, {value: 1}, {value: 3}, {value: 3}, {value: 3}, {readOnly: true, value: 1}, {value: 1}, {value: 3}, {value: 3}, {value: 3}],
        [{readOnly: true, value: 1}, {value: 1}, {value: 3}, {value: 3}, {value: 3}, {readOnly: true, value: 1}, {value: 1}, {value: 3}, {value: 3}, {value: 3}, {readOnly: true, value: 1}, {value: 1}, {value: 3}, {value: 3}, {value: 3}],
        [{readOnly: true, value: 1}, {value: 1}, {value: 3}, {value: 3}, {value: 3}, {readOnly: true, value: 1}, {value: 1}, {value: 3}, {value: 3}, {value: 3}, {readOnly: true, value: 1}, {value: 1}, {value: 3}, {value: 3}, {value: 3}],
        [{readOnly: true, value: 1}, {value: 1}, {value: 3}, {value: 3}, {value: 3}, {readOnly: true, value: 1}, {value: 1}, {value: 3}, {value: 3}, {value: 3}, {readOnly: true, value: 1}, {value: 1}, {value: 3}, {value: 3}, {value: 3}],
        [{readOnly: true, value: 1}, {value: 1}, {value: 3}, {value: 3}, {value: 3}, {readOnly: true, value: 1}, {value: 1}, {value: 3}, {value: 3}, {value: 3}, {readOnly: true, value: 1}, {value: 1}, {value: 3}, {value: 3}, {value: 3}],
        [{readOnly: true, value: 1}, {value: 1}, {value: 3}, {value: 3}, {value: 3}, {readOnly: true, value: 1}, {value: 1}, {value: 3}, {value: 3}, {value: 3}, {readOnly: true, value: 1}, {value: 1}, {value: 3}, {value: 3}, {value: 3}],
        [{readOnly: true, value: 1}, {value: 1}, {value: 3}, {value: 3}, {value: 3}, {readOnly: true, value: 1}, {value: 1}, {value: 3}, {value: 3}, {value: 3}, {readOnly: true, value: 1}, {value: 1}, {value: 3}, {value: 3}, {value: 3}],
        [{readOnly: true, value: 1}, {value: 1}, {value: 3}, {value: 3}, {value: 3}, {readOnly: true, value: 1}, {value: 1}, {value: 3}, {value: 3}, {value: 3}, {readOnly: true, value: 1}, {value: 1}, {value: 3}, {value: 3}, {value: 3}],
        [{readOnly: true, value: 1}, {value: 1}, {value: 3}, {value: 3}, {value: 3}, {readOnly: true, value: 1}, {value: 1}, {value: 3}, {value: 3}, {value: 3}, {readOnly: true, value: 1}, {value: 1}, {value: 3}, {value: 3}, {value: 3}],
        [{readOnly: true, value: 1}, {value: 1}, {value: 3}, {value: 3}, {value: 3}, {readOnly: true, value: 1}, {value: 1}, {value: 3}, {value: 3}, {value: 3}, {readOnly: true, value: 1}, {value: 1}, {value: 3}, {value: 3}, {value: 3}],
        [{readOnly: true, value: 1}, {value: 1}, {value: 3}, {value: 3}, {value: 3}, {readOnly: true, value: 1}, {value: 1}, {value: 3}, {value: 3}, {value: 3}, {readOnly: true, value: 1}, {value: 1}, {value: 3}, {value: 3}, {value: 3}],
        [{readOnly: true, value: 1}, {value: 1}, {value: 3}, {value: 3}, {value: 3}, {readOnly: true, value: 1}, {value: 1}, {value: 3}, {value: 3}, {value: 3}, {readOnly: true, value: 1}, {value: 1}, {value: 3}, {value: 3}, {value: 3}],
        [{readOnly: true, value: 1}, {value: 1}, {value: 3}, {value: 3}, {value: 3}, {readOnly: true, value: 1}, {value: 1}, {value: 3}, {value: 3}, {value: 3}, {readOnly: true, value: 1}, {value: 1}, {value: 3}, {value: 3}, {value: 3}],
        [{readOnly: true, value: 1}, {value: 1}, {value: 3}, {value: 3}, {value: 3}, {readOnly: true, value: 1}, {value: 1}, {value: 3}, {value: 3}, {value: 3}, {readOnly: true, value: 1}, {value: 1}, {value: 3}, {value: 3}, {value: 3}],
        [{readOnly: true, value: 1}, {value: 1}, {value: 3}, {value: 3}, {value: 3}, {readOnly: true, value: 1}, {value: 1}, {value: 3}, {value: 3}, {value: 3}, {readOnly: true, value: 1}, {value: 1}, {value: 3}, {value: 3}, {value: 3}],
        [{readOnly: true, value: 1}, {value: 1}, {value: 3}, {value: 3}, {value: 3}, {readOnly: true, value: 1}, {value: 1}, {value: 3}, {value: 3}, {value: 3}, {readOnly: true, value: 1}, {value: 1}, {value: 3}, {value: 3}, {value: 3}],
        [{readOnly: true, value: 1}, {value: 1}, {value: 3}, {value: 3}, {value: 3}, {readOnly: true, value: 1}, {value: 1}, {value: 3}, {value: 3}, {value: 3}, {readOnly: true, value: 1}, {value: 1}, {value: 3}, {value: 3}, {value: 3}],
        [{readOnly: true, value: 1}, {value: 1}, {value: 3}, {value: 3}, {value: 3}, {readOnly: true, value: 1}, {value: 1}, {value: 3}, {value: 3}, {value: 3}, {readOnly: true, value: 1}, {value: 1}, {value: 3}, {value: 3}, {value: 3}],
        [{readOnly: true, value: 1}, {value: 1}, {value: 3}, {value: 3}, {value: 3}, {readOnly: true, value: 1}, {value: 1}, {value: 3}, {value: 3}, {value: 3}, {readOnly: true, value: 1}, {value: 1}, {value: 3}, {value: 3}, {value: 3}],
        [{readOnly: true, value: 1}, {value: 1}, {value: 3}, {value: 3}, {value: 3}, {readOnly: true, value: 1}, {value: 1}, {value: 3}, {value: 3}, {value: 3}, {readOnly: true, value: 1}, {value: 1}, {value: 3}, {value: 3}, {value: 3}],
        [{readOnly: true, value: 1}, {value: 1}, {value: 3}, {value: 3}, {value: 3}, {readOnly: true, value: 1}, {value: 1}, {value: 3}, {value: 3}, {value: 3}, {readOnly: true, value: 1}, {value: 1}, {value: 3}, {value: 3}, {value: 3}],
        [{readOnly: true, value: 1}, {value: 1}, {value: 3}, {value: 3}, {value: 3}, {readOnly: true, value: 1}, {value: 1}, {value: 3}, {value: 3}, {value: 3}, {readOnly: true, value: 1}, {value: 1}, {value: 3}, {value: 3}, {value: 3}],
        [{readOnly: true, value: 1}, {value: 1}, {value: 3}, {value: 3}, {value: 3}, {readOnly: true, value: 1}, {value: 1}, {value: 3}, {value: 3}, {value: 3}, {readOnly: true, value: 1}, {value: 1}, {value: 3}, {value: 3}, {value: 3}],
        [{readOnly: true, value: 1}, {value: 1}, {value: 3}, {value: 3}, {value: 3}, {readOnly: true, value: 1}, {value: 1}, {value: 3}, {value: 3}, {value: 3}, {readOnly: true, value: 1}, {value: 1}, {value: 3}, {value: 3}, {value: 3}],
        [{readOnly: true, value: 1}, {value: 1}, {value: 3}, {value: 3}, {value: 3}, {readOnly: true, value: 1}, {value: 1}, {value: 3}, {value: 3}, {value: 3}, {readOnly: true, value: 1}, {value: 1}, {value: 3}, {value: 3}, {value: 3}],
      ]
    }
  }
  render () {
    return (
      <span>
      <ReactDatasheet
        data={this.state.grid}
        valueRenderer={(cell) => cell.value}
        onContextMenu={(e, cell, i, j) => cell.readOnly ? e.preventDefault() : null}
        onCellsChanged={changes => {
          const grid = this.state.grid.map(row => [...row])
          changes.forEach(({cell, row, col, value}) => {
            grid[row][col] = {...grid[row][col], value}
          })
          this.setState({grid})
        }}
      />
      <span id="seen" />
      <span id="message-list" />
      </span>
    )
  }
}

// const Spreadsheet = (props) => {

//   let messageList = [];

//   // for (let i = 0; i < props.messages.length; i++) {
//   //   if (props.messages[i]) {
//   //     messageList.push(
//   //       <Message
//   //         key={i}
//   //         message={props.messages[i]}
//   //         mine={props.messages[i].sentBy === localStorage.getItem('id')}
//   //         isDelivered={isDelivered(props.messages[i])}
//   //         isSeen={isSeen(props.messages[i])}
//   //         isLastSeen={isLastSeen(props.messages[i])}
//   //       />
//   //     );
//   //   }
//   // }

//   return (
//     <div id="message-list" styleName="list">
//       {messageList}
//       <ReactDataSheet
//         data={[
//         [
//           {readOnly: true, value: ''},
//           {value: 'A', readOnly: true},
//           {value: 'B', readOnly: true},
//           {value: 'C', readOnly: true},
//           {value: 'D', readOnly: true}
//         ],
//         [{readOnly: true, value: 1}, {value: 1}, {value: 3}, {value: 3}, {value: 3}],
//         [{readOnly: true, value: 2}, {value: 2}, {value: 4}, {value: 4}, {value: 4}],
//         [{readOnly: true, value: 3}, {value: 1}, {value: 3}, {value: 3}, {value: 3}],
//         [{readOnly: true, value: 4}, {value: 2}, {value: 4}, {value: 4}, {value: 4}]
//       ]}
//         valueRenderer={(cell) => cell.value}
//         onContextMenu={(e, cell, i, j) => cell.readOnly ? e.preventDefault() : null}
//         onCellsChanged={changes => {
//           // const grid = this.state.grid.map(row => [...row])
//           // changes.forEach(({cell, row, col, value}) => {
//           //   grid[row][col] = {...grid[row][col], value}
//           // })
//           // this.setState({grid})
//         }}
//       />
//       <span id="seen" />
//     </div>
//   )
// }

// export default CSSModules(Spreadsheet, styles);
//  