import { useRecoilState } from "recoil"
import { IsEnteredAtom } from "../stores"
import { Html, useProgress } from "@react-three/drei"
import styled, { keyframes } from "styled-components"; // ✅ 올바른 스타일 임포트

export const Loader = ({isCompleted}) => {
    const [isEntered, setIsEntered] = useRecoilState(IsEnteredAtom)
    const progress = useProgress()

    if (isEntered) return null
    return (
        <Html center>
            <BlurredBackground />
            <Container>
                <ProgressBar>
                    {isCompleted ? 100 : progress.progress}
                </ProgressBar>
                <EnterBtn onClick={()=>{
                    setIsEntered(true)
                     // 👉 start-guide UI를 띄움
                    const startGuide = document.getElementById('start-guide');
                    const startGuideBtn = document.getElementById('start-guide-btn');
                    if (startGuide && startGuideBtn) {
                        startGuide.style.display = 'block';
                        startGuideBtn.style.display = 'block';
                    }
                    startGuideBtn.addEventListener("click", () => {
                        startGuide.style.display = "none";
                        startGuideBtn.style.display = "none";
                      })
                }}>
                    Enter
                </EnterBtn>
            </Container>
        </Html>
    )
}

const blink = keyframes`
0% {
    opacity: 1;
}
50% {
    opacity: 0;
}
100% {
    opacity: 1;
}
`
const BlurredBackground = styled.div `
width: 400px;
heigth: 400px;
background-color: red;
border-radius: 50%;
filter: Blur(300px);
`
const Container = styled.div `
position: fixed;
top: 50%;
left: 50%;
transform: translate(-50%, -50%);
display: flex;
flex-direction: column;
justify-content: flex-start;
align-items: center;
gap: 20px;
`
const ProgressBar = styled.div `
font-size: 20px;
color: #ccc;
`
const EnterBtn = styled.div `
animation: ${blink} 1.5s infinite;
transition-duration: 0.4s;
font-size: 16px;
outline: none;
border: 0.5px solid #999;
padding: 8px 18px;
background-color: transparent;
color: #ccc;
border-radius: 8px;
cusor: pointer;
&:hover{
    background-color: #ccc;
    color: #dc4f00
}
`