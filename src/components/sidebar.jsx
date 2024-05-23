import React from 'react';
import styled from 'styled-components';

export default function Sidebar() {
    return(
        <SideBar>
            <FilterButton>#korean</FilterButton>
            <FilterButton>#vietnamese</FilterButton>
            <FilterButton>#sandwich</FilterButton>
            <FilterButton>#pizza</FilterButton>
            <FilterButton>#bar</FilterButton>
            <FilterButton>#burger</FilterButton>
            <FilterButton>#cheapeats</FilterButton>
        </SideBar>
    )
}
const FilterButton = styled.button`
  background-color: #FFFFFF;
  border: 1px solid rgb(209,213,219);
  border-radius: .5rem;
  box-sizing: border-box;
  color: #111827;
  font-family: "Inter var",ui-sans-serif,system-ui,-apple-system,system-ui,"Segoe UI",Roboto,"Helvetica Neue",Arial,"Noto Sans",sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji";
  font-size: .875rem;
  font-weight: 600;
  line-height: 1.25rem;
  padding: .75rem 1rem;
  text-align: center;
  text-decoration: none #D1D5DB solid;
  text-decoration-thickness: auto;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  cursor: pointer;
  user-select: none;
  -webkit-user-select: none;
  touch-action: manipulation;

&:hover {
  background-color: rgb(249,250,251);
}

&:focus {
  outline: 2px solid transparent;
  outline-offset: 2px;
}

&:focus-visible {
  box-shadow: none;
}

`

const SideBar = styled.div`
    position:fixed;
    top:60px;
    right:0;
    max-width:30vw;
    z-index:1;
    overflow-x: hidden;
    display:flex;
    background-color:none;
    padding:0 10px;
    gap:5px;
    justify-content:flex-end;
    flex-wrap: wrap;
`

