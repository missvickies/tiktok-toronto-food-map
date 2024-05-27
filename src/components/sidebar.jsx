import React from 'react';
import styled from 'styled-components';

export default function Sidebar({children}) {
    return(
        <SideBar>
            <FlexContainer>
            <h2>Filter by hashtag</h2>
            {/* <CloseBar>
                <div>X</div>
            </CloseBar> */}
            </FlexContainer>
        {children}
        </SideBar>
    )
}

function openNav() {
    document.getElementById("mySidebar").style.width = "250px";
    document.getElementById("main").style.transform = "translateX(-250px)";
  }
  
  function closeNav() {
    document.getElementById("mySidebar").style.width = "0";
    document.getElementById("main").style.transform = "";
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

