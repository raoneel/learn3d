import React, { useState } from 'react';
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  NavbarText
} from 'reactstrap';
import { myHistory } from '../util/routing';

const TopNavbar = (props: any) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => setIsOpen(!isOpen);

  return (
    <div>
      <Navbar color="dark" dark expand="md">
        <NavbarBrand href="/">Learn3D</NavbarBrand>
        <NavbarToggler onClick={toggle} />
        <Collapse isOpen={isOpen} navbar>
          <Nav className="mr-auto" navbar>
            <NavItem>
              <NavLink href="/documentation/">Documentation</NavLink>
            </NavItem>
            <NavItem>
              <NavLink href="https://learn3d.io">Videos</NavLink>
            </NavItem>
            <UncontrolledDropdown nav inNavbar>
              <DropdownToggle nav caret>
                Examples
              </DropdownToggle>
              <DropdownMenu right>
                <DropdownItem onClick={() => myHistory.push("/space/bgy1tHVk")}>
                  Sphere
                </DropdownItem>
                <DropdownItem onClick={() => myHistory.push("/space/JcjpTqSY")}>
                  Waves
                </DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>
          </Nav>
          <NavLink color="light" href="https://neelmango.com">by NeelMango</NavLink>
        </Collapse>
      </Navbar>
    </div>
  );
}

export default TopNavbar;