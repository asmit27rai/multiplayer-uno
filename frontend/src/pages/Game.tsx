import { useEffect, useMemo, useState } from 'react';
import { useGameContext } from '../contexts/GameContext';
import Button from '../library/button';
import { useModal } from '../library/modal/ModalContext';
import CopyButton from '../library/copyButton';
import Chatbox from '../library/chatbox/Chatbox';
import { GameEventTypes } from '../../../backend/src/types';
import * as channel from '../channel';
import { IoSettings } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import { triggerEvent } from '../channel';
import { useAuth } from '../contexts/AuthContext';

function Game() {
    const { gameState } = useGameContext();
    const { getUser } = useAuth();
    const navigate = useNavigate();
    const [FirstUser, setFirstUser] = useState(true);
    const modal = useModal();
    const userCards = useMemo(() => {
        const cards = [
            'r0',
            'r1',
            'r2',
            'r3',
            'r4',
            'r5',
            'r6',
            'r7',
            'r8',
            'r9',
            'rp2',
            'rx',
            'rr',
            'g0',
            'g1',
            'g2',
            'g3',
            'g4',
            'g5',
            'g6',
            'g7',
            'g8',
            'g9',
            'gp2',
            'gx',
            'gr',
            'b0',
            'b1',
            'b2',
            'b3',
            'b4',
            'b5',
            'b6',
            'b7',
            'b8',
            'b9',
            'bp2',
            'bx',
            'br',
            'o0',
            'o1',
            'o2',
            'o3',
            'o4',
            'o5',
            'o6',
            'o7',
            'o8',
            'o9',
            'op2',
            'ox',
            'or',
            // 'zzzz',
            'P4',
            'CC',
        ];
        const shuffledCards = [...cards].sort(() => Math.random() - 0.5);
        return shuffledCards.slice(0, 7);
    }, []);
    useEffect(() => {
        modal.show(<GamePropertiesModal />, 'large', [], false);
        // eslint-disable-next-line
    }, []); // todo add the required dependencies
    const drawCard = () => {
        channel.triggerEvent({
            type: GameEventTypes.DRAW_CARD,
        });
    };
    const announceUno = () => {
        channel.triggerEvent({
            type: GameEventTypes.ANNOUNCE_UNO,
        });
    };

    function handleLeaveGame() {
        triggerEvent({
            type: GameEventTypes.LEAVE_GAME,
            data: null,
        });
        navigate('/');
    }

    function handleStartGame() {
        triggerEvent({
            type: GameEventTypes.LEAVE_GAME,
            data: null,
        });
        setFirstUser(false);
        modal.hide();
    }

    function GamePropertiesModal() {
        const currentUser = getUser();
        const isHost =
            currentUser &&
            gameState.players[0] &&
            currentUser.id === gameState.players[0].id;

        return (
            <>
                <div className="flex flex-col items-center justify-center p-4 space-y-6">
                    <div className="flex justify-center items-center w-full pl-6">
                        <h1 className="font-normal font-[Kavoon] text-[30px] leading-[30px] text-[#333] text-center inline-block ml-auto">
                            Start Game
                        </h1>
                        <i
                            className="fa-solid fa-circle-xmark cursor-pointer text-3xl ml-auto mr-3"
                            onClick={modal.hide}
                        ></i>
                    </div>
                    <div className="flex justify-center px-5">
                        <h2 className="text-bold font-bold  font-[Kavoon]  text-[#333] text-[20px]">
                            Game Id :{' '}
                            <span className="text-[#555] ">
                                {' '}
                                {gameState.id}
                            </span>
                            &nbsp; <CopyButton copyText={gameState.id} />
                        </h2>
                    </div>
                    <div className="flex justify-center px-5">
                        <h2 className="text-bold font-bold  text-[#333]  font-[Kavoon] text-[20px]">
                            Players Joined :{' '}
                            <span className="text-[#555] font-[Roboto]">
                                {gameState.players.length}
                            </span>
                        </h2>
                    </div>
                    <div className="flex justify-center px-5">
                        <h2 className="text-bold font-bold  text-[#333]  font-[Kavoon] text-[20px]">
                            Invite More Players : &nbsp;
                            <CopyButton
                                priorText="Copy Invite Link"
                                copyText={`${window.location.origin}/game?type=join&code=${gameState.id}`}
                                postText="Copied"
                            />
                        </h2>
                    </div>
                    <div className="flex gap-5">
                        {isHost && FirstUser && (
                            <Button type={'submit'} onClick={handleStartGame}>
                                Start Game
                            </Button>
                        )}
                        <Button type={'button'} onClick={handleLeaveGame}>
                            Leave Game
                        </Button>
                    </div>
                </div>
            </>
        );
    }

    const playerPositions = [
        { top: '12%', left: '29%', transform: 'translate(-50%, -50%)' },
        { top: '12%', left: '71%', transform: 'translate(-50%, -50%)' },
        { top: '40%', left: '10%', transform: 'translate(-50%, -50%)' },
        { top: '40%', left: '90%', transform: 'translate(-50%, -50%)' },
        { top: '75%', left: '15%', transform: 'translate(-50%, -50%)' },
        { top: '75%', left: '85%', transform: 'translate(-50%, -50%)' },
    ];

    const cardStyles = {
        filter: 'brightness(1)',
    };

    if (!gameState) {
        return (
            <div className="bg-gray-800 h-screen text-white text-5xl font-kavoon text-center">
                Loading...
            </div>
        );
    }
    return (
        <div className="flex justify-center items-center min-h-screen bg-table-bg bg-cover">
            <div className="relative w-full max-w-6xl h-[75vh]">
                <div className="absolute top-4 left-1/2 transform -translate-x-1/2 text-yellow-400 text-xl font-bold">
                    {gameState.players[gameState.currentPlayerIndex].name}'s
                    Turn
                </div>
                {/* Players */}
                {gameState.players.slice(0, 6).map((player, index) => (
                    <div
                        key={index}
                        className={`absolute flex flex-col items-center justify-center bg-player-icon-bg`}
                        style={{
                            ...playerPositions[index],
                            backgroundSize: 'contain',
                            backgroundRepeat: 'no-repeat',
                            width: '70px',
                            height: '80px',
                            zIndex: 2,
                            ...(index === gameState.currentPlayerIndex && {
                                ...cardStyles,
                                filter: 'brightness(1.5)',
                            }),
                        }}
                    >
                        <div className="player-cards text-black mt-[61px]">
                            {player.cards.length}
                        </div>
                    </div>
                ))}

                {/* Center Deck and UNO Button */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center z-10">
                    <div className="relative flex">
                        <img
                            src="/cardPool.png"
                            alt="Card Pool"
                            className="w-56 h-36"
                        />
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex space-x-4 z-20">
                            <img
                                src="/card_faces/back.jpeg"
                                alt="Card 1"
                                className="w-15 h-20 cursor-pointer"
                                onClick={drawCard}
                            />
                            <img
                                src={
                                    gameState.lastThrownCard
                                        ? `/card_faces/${gameState.lastThrownCard}.svg`
                                        : '/card_faces/back.jpeg'
                                }
                                alt="Last Thrown Card"
                                className="w-15 h-20"
                            />
                        </div>
                    </div>
                    <Button
                        variant="accept"
                        size="small"
                        className="border-2 active:bg-red-600 mt-4 hover:bg-purple-900"
                        backgroundColor="bg-purple-800"
                        buttonSize="w-18 h-10"
                        onClick={announceUno}
                    >
                        UNO
                    </Button>
                </div>

                {/* Player Mat */}
                {/* <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 flex flex-col items-center z-20"> */}
                <div className="absolute top-[80%] flex z-30 flex-row w-full justify-center h-96">
                    {userCards.map((card, index) => (
                        <img
                            key={index}
                            src={`/card_faces/${card}.svg`}
                            alt={`Card ${index}`}
                            className="w-60 h-80 self-end"
                            style={{
                                marginLeft: index === 0 ? 0 : '-6.4rem',
                                zIndex: 11 + index,
                            }}
                        />
                    ))}
                </div>
                {/* </div> */}
            </div>

            <Chatbox />

            <button
                className="fixed bottom-5 left-5 p-3 bg-lime-500 text-gray-700 rounded-full focus:outline-none transform transition-transform duration-300 hover:scale-105 hover:bg-lime-400 active:bg-lime-600 shadow-md"
                onClick={() =>
                    modal.show(<GamePropertiesModal />, 'large', [], false)
                }
            >
                <IoSettings className="w-7 h-7" />
            </button>
        </div>
    );
}

export default Game;
