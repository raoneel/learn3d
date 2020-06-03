import React from "react";
import SplitterLayout from 'react-splitter-layout';
import 'react-splitter-layout/lib/index.css';
import CodeEditor from "./CodeEditor";
import { NoaContainer } from "./NoaContainer";

export interface HomeProps {}

export interface HomeState {}

export default class Home extends React.PureComponent<HomeProps, HomeState> {
  constructor(props: HomeProps) {
    super(props);

    this.state = {};
  }
  public render() {
    return (
      <SplitterLayout primaryIndex={0} primaryMinSize={60} percentage>
        <NoaContainer />
        <CodeEditor />
      </SplitterLayout>
    );
  }
}