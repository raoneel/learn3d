import React from "react";
import SplitterLayout from "react-splitter-layout";
import "react-splitter-layout/lib/index.css";
import CodeEditor from "./CodeEditor";
import { NoaContainer } from "./NoaContainer";
import { RouteComponentProps } from "react-router-dom";

interface MatchParams {
  workspaceId: string;
}

export interface HomeProps extends RouteComponentProps<MatchParams> {}

export interface HomeState {}

export default class Home extends React.PureComponent<HomeProps, HomeState> {
  myWorkspaceId: string = "";

  constructor(props: HomeProps) {
    super(props);

    this.state = {};
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
  }

  public render() {
    return (
      <SplitterLayout primaryIndex={0} secondaryInitialSize={40} percentage>
        <NoaContainer />
        <CodeEditor setWorkspaceId={this.setWorkspaceId} workspaceId={this.props.match.params.workspaceId} />
      </SplitterLayout>
    );
  }
}
