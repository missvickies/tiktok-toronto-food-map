import React from 'react';
import styled from 'styled-components';
import { RiCloseLargeLine } from "react-icons/ri";


export default function Sidebar({children}) {
    return(
        <SideBar>
            <FlexContainer>
            <h2>Filter by hashtag</h2>
            <CloseBar>
                <div>X</div>
            </CloseBar>
            </FlexContainer>
        {children}
        </SideBar>
    )
}

const CloseBar = styled.div`
&:hover{
    background-color:grey;
}
`

const FlexContainer = styled.div`
    display:flex;
    justify-content: space-between;
    align-items:center;
`
const SideBar = styled.div`
    position:fixed;
    top:60px;
    right:0;
    max-width:30vw;
    z-index:1;
    overflow-x: hidden;
    display:inline-block;
    background-color:white;
    padding:0 18px 18px 18px;
    gap:5px;
`

