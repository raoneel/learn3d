import React from "react";
import SplitterLayout from "react-splitter-layout";
import "react-splitter-layout/lib/index.css";
import CodeEditor from "./CodeEditor";
import { NoaContainer } from "./NoaContainer";
import { RouteComponentProps } from "react-router-dom";
import "./Home.scss";

interface MatchParams {
  workspaceId: string;
}

export interface HomeProps extends RouteComponentProps<MatchParams> {}

export interface HomeState {
  mobileView: "NOA" | "CODE";
  deviceWidth: number;
}

export default class Home extends React.Component<HomeProps, HomeState> {
  myWorkspaceId: string = "";

  constructor(props: HomeProps) {
    super(props);

    this.state = {
      mobileView: "CODE",
      deviceWidth: window.innerWidth,
    };
  }

  shouldComponentUpdate(nextProps: HomeProps) {
    // Skip re-render if this was the workspace
    // You just created
    if (nextProps.match.params.workspaceId === this.myWorkspaceId) {
      console.log("skipping rerender");
      return false;
    }

    return true;
  }

  setWorkspaceId = (newId: string) => {
    this.myWorkspaceId = newId;
  };

  onClickSwitchViewMobile = () => {
    this.setState({
      mobileView: this.state.mobileView === "CODE" ? "NOA" : "CODE",
    });
  };

  public render() {
    // Mobile Layout
    if (this.state.deviceWidth < 800) {
      return (
        <div className="Home-MobileContainer">
          <div className="Home-MobileTabs">
            <div
              style={{
                display: this.state.mobileView === "CODE" ? "none" : "block",
              }}
              className="Home-NoaContainer"
            >
              <NoaContainer />
            </div>
            <div
              style={{
                display: this.state.mobileView === "NOA" ? "none" : "block",
              }}
              className="Home-CodeContainer"
            >
              <CodeEditor
                setWorkspaceId={this.setWorkspaceId}
                workspaceId={this.props.match.params.workspaceId}
              />
            </div>
          </div>
          <div
            onClick={this.onClickSwitchViewMobile}
            className="Home-MobileSwitcher noselect"
          >
            Switch to {this.state.mobileView === "CODE" ? "Game" : "Code"} View
          </div>
        </div>
      );
    }

    return (
      <SplitterLayout primaryIndex={0} secondaryInitialSize={40} percentage>
        <NoaContainer />
        <CodeEditor
          setWorkspaceId={this.setWorkspaceId}
          workspaceId={this.props.match.params.workspaceId}
        />
      </SplitterLayout>
    );
  }
}
