import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useState, useEffect } from 'react'
import axios from 'axios';

export function New_Meeting_Modal(props) {
    const [pw_chkbox, set_pw_chkbox] = useState(true);
    const [Meeting_Option, SetOptions] = useState({
        RoomTitle: '',
        pw: '',
        record: ''
    })

    const { RoomTitle, pw, record } = Meeting_Option;

    const chkbox_click = () => {
        set_pw_chkbox(!pw_chkbox)
        SetOptions({
            ...Meeting_Option,
            pw: ''
        })
    }

    const displayText = (e) => {
        SetOptions({
            ...Meeting_Option,
            [e.target.name]: e.target.value,
        })
    };

    const IsRecord = (e) => {
        SetOptions({
            ...Meeting_Option,
            record: e.target.value
        })
    }

    const generateRandomString = (num) => {
        const characters =
          "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
        let result = "";
        const charactersLength = characters.length;
        for (let i = 0; i < num; i++) {
          result += characters.charAt(
            Math.floor(Math.random() * charactersLength)
          );
        }

        return result;
    };

    const CreateRoomInDatabase = async () => {
        var code = generateRandomString(8)
        if (record == '') {
            record = 'false'
        }
        if (pw == '') {
            pw = 'null'
        }
        var send_data = {
            title: RoomTitle,
            users: 'seokmin',
            password: pw,
            code: code,
            record: record
        }

        var url = "https://wv9wwf.deta.dev/api/database/meeting";

        try {
            const resp = await axios.post(url, send_data);
            alert('새 회의을 만들었습니다!');
            SetOptions({
                ...Meeting_Option,
                RoomTitle: ''
            })
            location.href = `https://wv9wwf.deta.dev/meeting/${code}`
        } catch (error) {
            console.log(error.response);
            alert('회의를 만드는데 문제가 생겼습니다. 관리자에게 문의하세요.');
        }
    }

    return (
        <Modal {...props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered>
            <Modal.Header closeButton>
                <Modal.Title>새 회의 호스트</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                        <Form.Label>방 이름</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder=""
                            autoFocus
                            autoComplete='false'
                            value={RoomTitle}
                            name="RoomTitle"
                            onChange={displayText}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Check type='checkbox' label={'비밀번호 설정'} onClick={() => chkbox_click()} />
                        <Form.Control type="password" name='pw' disabled={pw_chkbox} placeholder="****" value={pw} onChange={displayText} />
                    </Form.Group>
                    <Form.Group>
                        <Form.Select aria-label="Record Message" onChange={IsRecord}>
                            <option value='false'>🎥 회의 내용 기록</option>
                            <option value='true'>저장 함</option>
                        </Form.Select>
                        <Form.Text>
                            기본값: 저장 안함
                        </Form.Text>
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="primary" onClick={() => CreateRoomInDatabase()}>
                    만들기
                </Button>
            </Modal.Footer>
        </Modal>
    )
}

export function Attend_Meeting_Modal(props) {
    const [MeetingCode, SetCode] = useState("");

    const AttendMeeting = () => {
        location.href = `https://wv9wwf.deta.dev/meeting/${MeetingCode}`
    }

    return (
        <Modal {...props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered>
            <Modal.Header closeButton>
                <Modal.Title>회의 참가</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                    <Form.Label>회의 코드</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="AbCdEfGh"
                        autoFocus
                        autoComplete='false'
                        onChange={(e) => SetCode(e.target.value)}
                    />
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="primary" onClick={AttendMeeting}>
                    참가
                </Button>
            </Modal.Footer>
        </Modal>
    )
}

export function CreateToDoListModal(props) {
    const [MemoTitle, SetTitle] = useState("");
    const [MemoContent, SetContent] = useState("");

    const handleTitle = (e) => {
        SetTitle(e.target.value);
    }

    const handleContent = (e) => {
        SetContent(e.target.value);
    }

    const PostMemoInDatabase = async () => {
        var url = "https://wv9wwf.deta.dev/api/database/memo";
        var send_data = {
            title: MemoTitle,
            content: MemoContent
        }

        try {
            const resp = await axios.post(url, send_data);
            alert('새 메모를 저장했습니다.');
        } catch (error) {
            console.log(error.response);
            alert('메모를 저장하는데 문제가 생겼습니다. 관리자에게 문의하세요.');
        }
    }
    return (
        <Modal {...props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered>
            <Modal.Header closeButton>
                <Modal.Title>새로운 메모</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                    <Form.Label>제목</Form.Label>
                    <Form.Control
                        type="text"
                        autoFocus
                        autoComplete='false'
                        value={MemoTitle}
                        onChange={handleTitle}
                    />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>내용</Form.Label>
                        <Form.Control
                            autoComplete='false'
                            as="textarea" rows={4}
                            style={{resize: 'none'}}
                            value={MemoContent}
                            onChange={handleContent}
                        />
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="primary" onClick={PostMemoInDatabase}>
                    저장
                </Button>
            </Modal.Footer>
        </Modal>
    )
}