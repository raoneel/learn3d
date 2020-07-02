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
} from 'reactstrap';
import { NavLink as RRNavLink } from 'react-router-dom';

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
              <NavLink tag={RRNavLink} to="/documentation/">Documentation</NavLink>
            </NavItem>
            <NavItem>
              <NavLink href="#">Tutorials</NavLink>
            </NavItem>
            <UncontrolledDropdown nav inNavbar>
              <DropdownToggle nav caret>
                Examples
              </DropdownToggle>
              <DropdownMenu right>
                <DropdownItem tag={RRNavLink} exact to="/space/bgy1tHVk">
                  Sphere
                </DropdownItem>
                <DropdownItem tag={RRNavLink} exact to="/space/JcjpTqSY">
                  Waves
                </DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>
            <NavItem>
              <NavLink href="https://discord.gg/CVhtCGq">Discord</NavLink>
            </NavItem>
            <NavItem>
              <NavLink href="https://github.com/raoneel/learn3d">GitHub</NavLink>
            </NavItem>
          </Nav>
          <NavLink color="light" href="https://neelmango.com">by NeelMango</NavLink>
        </Collapse>
      </Navbar>
    </div>
  );
}

export default TopNavbar;