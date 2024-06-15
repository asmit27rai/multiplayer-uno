import { useRef, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from './button';
import { ToastContext } from './toast/toast-context';

interface ModalProps {
    onClose: () => void;
}

const Modal: React.FC<ModalProps> = ({ onClose }) => {
    const modalRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();
    const [gameCode, setGameCode] = useState('');
    const { open } = useContext(ToastContext);

    const closeModal = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        if (modalRef.current === e.target) {
            onClose();
        }
    };

    const handleButtonClick = () => {
        if (gameCode.trim()) {
            navigate('/game?type=join&code=' + gameCode);
        } else {
            open({
                message: 'Please Enter The Game Code',
                duration: 3000,
                position: 'top-center',
                color: 'warning',
            });
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setGameCode(e.target.value.trim());
    };

    return (
        <div
            ref={modalRef}
            onClick={closeModal}
            className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
        >
            <div className="bg-[rgb(222,209,209)] p-5 rounded-xl border-4 border-black shadow-md flex flex-col gap-4 w-full max-w-lg items-center justify-center">
                <h1 className="font-normal font-[Kavoon] text-[30px] leading-[30px] text-black text-center">
                    Join an Existing Game
                </h1>
                <div className="flex justify-center w-full px-4">
                    <input
                        className="font-normal font-[Kavoon] text-[14px] lg:text-[20px] py-2 px-4 lg:px-28 border-4 border-black rounded-3xl w-full h-12"
                        placeholder="Enter the game code"
                        style={{
                            backgroundColor: 'rgb(222, 209, 209)',
                            color: 'black',
                        }}
                        value={gameCode}
                        onChange={handleInputChange}
                    />
                </div>
                <Button
                    text="Enter"
                    onClick={handleButtonClick}
                    backgroundColor="bg-yellow-300"
                    textColor="text-white"
                    borderColor="border-black border-4"
                    hoverColor="hover:bg-yellow-400"
                    rounded="rounded-full"
                    buttonSize="w-32 h-10"
                />
            </div>
        </div>
    );
};

export default Modal;
