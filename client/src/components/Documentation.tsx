import * as React from "react";
import { Container, Row, Col } from "reactstrap";

export default function Documentation() {
  return (
    <div
      style={{ backgroundColor: "#1f1d19" }}
      className="Documentation h-100 text-light"
    >
      <Container className="pt-3">
        <Row>
          <Col>
            <h2>World</h2>
            <p>
              Learn3D is a 100x100x100 size world. The X and Z axes are on the
              ground level, and the Y axis is up/down.
            </p>
          </Col>
        </Row>
        <Row>
          <Col>
            <DocBlock
              title="setBlock(x: number, y: number, z: number)"
              description="Set's a block at the specified x, y, z coordinates. Number should be between
              0 and 99 inclusive."
            >
              <code>Example: setBlock(50, 0, 99)</code>
            </DocBlock>
            <DocBlock
              title="setColor(color: string)"
              description="Sets the color to the hex string specified. Any blocks drawn after this will have this color."
            >
              <p>
                Not every color is possible. If you specify a color not included
                in{" "}
                <a href="https://github.com/raoneel/learn3d/blob/master/client/src/noa/noaBlockSetup.ts">
                  this list
                </a>
                , it will round to the nearest color.
              </p>
              <code>Example: setColor("#ff0000")</code>
            </DocBlock>
            <DocBlock
              title="setRandomColor()"
              description="Chooses a random color from the palette. See setColor for more info."
            >
              <code>Example: setRandomColor()</code>
            </DocBlock>
            <DocBlock
              title="setSkyColor(color: string)"
              description="Sets the color of the sky to the hex string specified. Unlike setColor(), this accepts any color."
            >
              <code>Example: setRandomColor("#ff0a3b")</code>
            </DocBlock>
            <DocBlock
              title="setTransparent()"
              description="Subsequent blocks will be drawn as air (a transparent block)."
            >
              <code>Example: setTransparent()</code>
            </DocBlock>
            <DocBlock
              title="log(message: string)"
              description="Log a message into the built in console."
            >
              <code>Example: log("Hello World")</code>
            </DocBlock>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

interface DocBlockProps {
  title: string;
  description: string;
  children?: any;
}

function DocBlock(props: DocBlockProps) {
  return (
    <div className="mb-5">
      <h2>{props.title}</h2>
      <p>{props.description}</p>
      {props.children}
    </div>
  );
}
