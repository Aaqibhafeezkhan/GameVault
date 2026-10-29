import { createContext, useContext, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { theme } from "../../styles/theme";
import { useLocalStorage } from "../../hooks/useLocalStorage";

const GameShellContext = createContext(null);

export function useGameShell() {
  return useContext(GameShellContext);
}

const MODAL_OVERLAY_Z = 200;

export default function GameShell({ title, children }) {
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [paused, setPaused] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [best, setBest] = useLocalStorage(`gv_best_${title}`, 0);

  const handleSetScore = useCallback(
    (val) => {
      const newScore = typeof val === "function" ? val(score) : val;
      setScore(newScore);
      if (newScore > best) setBest(newScore);
    },
    [score, best, setBest],
  );

  const handleSetGameOver = useCallback((val) => {
    setGameOver(val);
    if (val) setPaused(true);
  }, []);

  const handleRestart = useCallback(() => {
    setScore(0);
    setGameOver(false);
    setPaused(false);
  }, []);

  const ctx = {
    score,
    setScore: handleSetScore,
    best,
    gameOver,
    setGameOver: handleSetGameOver,
    paused,
    setPaused,
    soundEnabled,
  };

  return (
    <GameShellContext.Provider value={ctx}>
      <SShell>
        <STopBar>
          <SGameTitle>{title}</SGameTitle>
          <SMetaRow>
            <SMetaItem>
              <SMetaLabel>SCORE</SMetaLabel>
              <SMetaValue>{score}</SMetaValue>
            </SMetaItem>
            <SMetaItem>
              <SMetaLabel>BEST</SMetaLabel>
              <SMetaValue>{best}</SMetaValue>
            </SMetaItem>
          </SMetaRow>
          <SControls role="group" aria-label="Game controls">
            <SIconBtn
              type="button"
              title={soundEnabled ? "Mute" : "Unmute"}
              aria-label={soundEnabled ? "Mute sound" : "Unmute sound"}
              onClick={() => setSoundEnabled((e) => !e)}
            >
              {soundEnabled ? "🔊" : "🔇"}
            </SIconBtn>
            <SIconBtn
              type="button"
              title={paused ? "Resume" : "Pause"}
              aria-label={paused && !gameOver ? "Resume game" : "Pause game"}
              onClick={() => setPaused((p) => !p)}
              disabled={gameOver}
            >
              {paused && !gameOver ? "▶" : "⏸"}
            </SIconBtn>
            <SIconBtn
              type="button"
              title="Restart"
              aria-label="Restart game"
              onClick={handleRestart}
            >
              ↺
            </SIconBtn>
            <SBackBtn as={Link} to="/" aria-label="Return to games catalog">
              ← Games
            </SBackBtn>
          </SControls>
        </STopBar>
        <SContent>{children}</SContent>
        {gameOver && (
          <SModalOverlay>
            <SModal role="dialog" aria-modal="true" aria-labelledby="game-over-title">
              <SModalEyebrow>ROUND COMPLETE</SModalEyebrow>
              <SModalTitle id="game-over-title">Game Over</SModalTitle>
              <SModalScore>{score}</SModalScore>
              <SModalLabel>SCORE</SModalLabel>
              {score >= best && score > 0 && <SNewBest>NEW BEST!</SNewBest>}
              <SModalBest>Best: {best}</SModalBest>
              <SModalActions>
                <SModalBtn type="button" onClick={handleRestart}>
                  Play Again
                </SModalBtn>
                <SModalBtn as={Link} to="/" $secondary>
                  Games
                </SModalBtn>
              </SModalActions>
            </SModal>
          </SModalOverlay>
        )}
        {paused && !gameOver && (
          <SPausedOverlay 
            role="button" 
            tabIndex={0} 
            aria-label="Paused. Click or press enter to resume"
            onClick={() => setPaused(false)}
            onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") setPaused(false); }}
          >
            <SPausedCard>
              <SPausedTitle>Paused</SPausedTitle>
              <SPausedText>Click or press any key to continue</SPausedText>
            </SPausedCard>
          </SPausedOverlay>
        )}
      </SShell>
    </GameShellContext.Provider>
  );
}

const SShell = styled.div`
  display: flex;
  flex-direction: column;
  min-height: calc(100vh - 64px);
`;

const STopBar = styled.div`
  background: rgba(255, 255, 255, 0.94);
  border-bottom: 1px solid ${theme.colors.border};
  box-shadow: 0 2px 12px rgba(35, 42, 68, 0.04);
  padding: ${theme.space[3]}px ${theme.space[4]}px;
  display: flex;
  align-items: center;
  gap: ${theme.space[4]}px;
  flex-wrap: wrap;
  position: sticky;
  top: 64px;
  z-index: 50;
`;

const SGameTitle = styled.h1`
  font-family: ${theme.font.display};
  font-size: 1rem;
  font-weight: 700;
  color: ${theme.colors.text};
  margin-right: auto;
`;

const SMetaRow = styled.div`
  display: flex;
  gap: ${theme.space[4]}px;
  padding: 0 ${theme.space[3]}px;
`;

const SMetaItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 48px;
`;

const SMetaLabel = styled.span`
  font-family: ${theme.font.mono};
  font-size: 0.58rem;
  color: ${theme.colors.textMuted};
  letter-spacing: 0.08em;
`;

const SMetaValue = styled.span`
  font-family: ${theme.font.mono};
  font-size: 1rem;
  font-weight: 700;
  color: ${theme.colors.accent};
`;

const SControls = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.space[2]}px;
`;

const SIconBtn = styled.button`
  background: ${theme.colors.bg};
  border: 1px solid ${theme.colors.border};
  color: ${theme.colors.textMuted};
  border-radius: ${theme.radius.sm};
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.85rem;
  cursor: pointer;
  transition: transform 150ms ease-out, border-color 150ms ease-out, color 150ms ease-out, background 150ms ease-out;

  &:hover:not(:disabled) {
    transform: translateY(-1px);
    border-color: ${theme.colors.accent};
    color: ${theme.colors.accent};
    background: ${theme.colors.surface};
  }

  &:focus-visible {
    outline: 2px solid ${theme.colors.accent};
    outline-offset: 2px;
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
`;

const SBackBtn = styled.button`
  background: ${theme.colors.bg};
  border: 1px solid ${theme.colors.border};
  color: ${theme.colors.textMuted};
  border-radius: ${theme.radius.sm};
  padding: 0 ${theme.space[3]}px;
  height: 36px;
  font-family: ${theme.font.mono};
  font-size: 0.68rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: ${theme.space[1]}px;
  cursor: pointer;
  transition: border-color 150ms ease-out, color 150ms ease-out, background 150ms ease-out;
  text-decoration: none;

  &:hover {
    border-color: ${theme.colors.accent};
    color: ${theme.colors.accent};
    background: ${theme.colors.surface};
  }

  &:focus-visible {
    outline: 2px solid ${theme.colors.accent};
    outline-offset: 2px;
  }
`;

const SContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: clamp(16px, 3vw, 40px);
`;

const SModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(28, 32, 49, 0.48);
  backdrop-filter: blur(5px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${theme.space[4]}px;
  z-index: ${MODAL_OVERLAY_Z};
`;

const SModal = styled.div`
  background: ${theme.colors.surface};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.radius.lg};
  padding: ${theme.space[6]}px;
  min-width: min(340px, 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${theme.space[2]}px;
  box-shadow: ${theme.shadows.floating};
`;

const SModalEyebrow = styled.div`
  font-family: ${theme.font.mono};
  font-size: 0.62rem;
  font-weight: 600;
  color: ${theme.colors.accent};
  letter-spacing: 0.14em;
`;

const SModalTitle = styled.h2`
  font-family: ${theme.font.display};
  font-size: 1.6rem;
  color: ${theme.colors.text};
`;

const SModalScore = styled.div`
  font-family: ${theme.font.mono};
  font-size: 3.4rem;
  font-weight: 700;
  color: ${theme.colors.accent};
  line-height: 1;
  margin-top: ${theme.space[2]}px;
`;

const SModalLabel = styled.div`
  font-family: ${theme.font.mono};
  font-size: 0.62rem;
  color: ${theme.colors.textMuted};
  letter-spacing: 0.1em;
`;

const SNewBest = styled.div`
  font-family: ${theme.font.mono};
  font-size: 0.7rem;
  font-weight: 700;
  color: ${theme.colors.success};
  letter-spacing: 0.1em;
`;

const SModalBest = styled.div`
  font-family: ${theme.font.mono};
  font-size: 0.78rem;
  color: ${theme.colors.textMuted};
`;

const SModalActions = styled.div`
  display: flex;
  gap: ${theme.space[2]}px;
  margin-top: ${theme.space[3]}px;
`;

const SModalBtn = styled.button`
  background: ${(props) =>
    props.$secondary ? theme.colors.bg : theme.colors.accent};
  border: 1px solid
    ${(props) => (props.$secondary ? theme.colors.border : theme.colors.accent)};
  color: ${(props) =>
    props.$secondary ? theme.colors.textMuted : "#fff"};
  border-radius: ${theme.radius.sm};
  padding: ${theme.space[2]}px ${theme.space[4]}px;
  font-family: ${theme.font.mono};
  font-size: 0.72rem;
  font-weight: 600;
  cursor: pointer;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  transition: transform 150ms ease-out, background 150ms ease-out;

  &:hover {
    transform: translateY(-1px);
    background: ${(props) =>
      props.$secondary ? theme.colors.surfaceAlt : "#5749c2"};
  }

  &:focus-visible {
    outline: 2px solid ${theme.colors.accent};
    outline-offset: 2px;
  }
`;

const SPausedOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(28, 32, 49, 0.34);
  backdrop-filter: blur(3px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: ${MODAL_OVERLAY_Z};
  cursor: pointer;

  &:focus-visible {
    outline: 2px solid ${theme.colors.accent};
    outline-offset: -2px;
  }
`;

const SPausedCard = styled.div`
  background: ${theme.colors.surface};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.radius.lg};
  padding: ${theme.space[5]}px ${theme.space[6]}px;
  box-shadow: ${theme.shadows.floating};
  text-align: center;
`;

const SPausedTitle = styled.div`
  font-family: ${theme.font.display};
  font-size: 1.5rem;
  font-weight: 700;
  color: ${theme.colors.text};
`;

const SPausedText = styled.div`
  margin-top: ${theme.space[1]}px;
  font-size: 0.8rem;
  color: ${theme.colors.textMuted};
`;