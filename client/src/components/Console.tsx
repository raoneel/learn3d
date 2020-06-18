import React from "react";
import { connect } from "react-redux";
import { MyReduxState } from "../redux/store";
import ScrollableFeed from "react-scrollable-feed";
import "./Console.css";

export type ConsoleProps = ReturnType<typeof mapStateToProps>;

export interface ConsoleState {

}

export class Console extends React.PureComponent<
  ConsoleProps,
  ConsoleState
> {
  constructor(props: ConsoleProps) {
    super(props);

    this.state = {
      messages: []
    };
  }

  renderMessages() {
    return this.props.messages.map(message => {
      if (message.message) {
        return (
          <div className="Console-Error">{message.message}</div>
        )
      }

      return null;
    })
  }

  public render() {
    return (
      <div className="Console-MessageFeed" style={{ height: 100, maxHeight: 100 }}>
        <ScrollableFeed className="Console-ScrollableFeed" forceScroll={true}>
          {this.renderMessages()}
        </ScrollableFeed>
      </div>
    );
  }
}

function mapStateToProps(state: MyReduxState) {
  return {
    messages: state.console.messages
  }
}

export default connect(mapStateToProps)(Console);