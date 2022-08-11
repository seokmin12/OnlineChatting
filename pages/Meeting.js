import styles from '../styles/Meeting.module.css'
import { useState, useEffect } from 'react'
import { New_Meeting_Modal, Attend_Meeting_Modal } from './Modals'
import Link from 'next/link'
import axios from 'axios';
import Dropdown from 'react-bootstrap/Dropdown';

export const Meeting = () => {
    const [NewMeetingModalShow, SetNewMeetingShow] = useState(false);
    const [AttendMeetingModalShow, SetAttendMeetingShow] = useState(false);

    const handleNewMeetingClose = () => SetNewMeetingShow(false);
    const handleNewMeetingShow = () => SetNewMeetingShow(true);

    const handleAttendMeetingClose = () => SetAttendMeetingShow(false);
    const handleAttendMeetingShow = () => SetAttendMeetingShow(true);

    const [MeetList, SetMeetList] = useState({});


    const GetRoomInDatabase = async () => {
        var url = "https://wv9wwf.deta.dev/api/database/meeting?code=";

        try {
            const resp = await axios.get(url);
            SetMeetList(resp.data);
        } catch (error) {
            console.log(error.response);
            alert('데이터를 가져오는데 문제가 생겼습니다. 관리자에게 문의하세요.');
        }
    }

    const DeleteRoomFromDatabase = async (e) => {
        var room_number = e.target.id;
        
        var url = `https://wv9wwf.deta.dev/api/database/meeting/${room_number}`;

        try {
            const resp = await axios.delete(url);
            alert('회의실을 삭제하였습니다!');
            GetRoomInDatabase();
        } catch (error) {
            alert('회의실을 삭제하는데 문제가 생겼습니다. 관리자에게 문의하세요.');
        }
    }

    const Refresh = (e) => {
        var target = e.target;
        target.classList.add('refresh_btn');
        GetRoomInDatabase();
        setTimeout(() => {
            target.classList.remove('refresh_btn');
        }, 600)
    }

    useEffect(() => {
        GetRoomInDatabase();
    }, [])


    const meeting_rendering = (data) => {
        const result = [];
        if (data.length == 0) {
            result.push(
                <div key={0} style={{textAlign: "center"}}>
                    <span style={{color: "#adb5bd"}}>회의에 참가해주세요</span>
                </div>
            )
        } else {
            for(let i = 0; i < data.length; i++) {
                result.push(
                    <li className={styles.meeting_list_li} key={i}>
                        <div className={styles.meeting_list_info}>
                            <span className={styles.chatting_title}>{data[i].title}</span>
                            <span className={styles.chatting_people}>5</span>
                            <span className={styles.chatting_date}>7월 24일</span>
                        </div>
                        <div className={styles.slide_left}>
                            <div className={styles.btns}>
                                <Link href={`http://127.0.0.1:8000/meeting/${data[i].code}`}style={{textDecoration: 'none'}}>
                                    <span className={styles.enter_btn}>참가하기</span>
                                </Link>
                                <Dropdown>
                                    <Dropdown.Toggle as='span' bsPrefix='toggle'>
                                        <i className={`${styles.etc} ${'bi bi-three-dots-vertical'}`}></i>
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu id='dropdown-menu'>
                                        <Dropdown.Item id={data[i].number} onClick={DeleteRoomFromDatabase}>나가기</Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>
                            </div>
                        </div>
                    </li>
                )
            }
        }
        return result;
    }
    return (
        <div className={styles.wrap}>
            <div className={styles.header}>
                <div className={styles.header_top}>
                    <h1>회의</h1>
                </div>
                <div className={styles.header_bottom}>
                    <div className={styles.meeting_count}>
                        <i className={`${styles.history_icon} ${"bi bi-clock-history"}`}></i>
                        <span>최근 기록</span>
                    </div>
                    <div className={styles.meeting_options}>
                        <li className={`${styles.header_li} ${styles.new_meeting}`} onClick={handleNewMeetingShow}>
                            <i className={`${styles.video_icon} ${"bi bi-camera-video"}`}></i>
                            <span>새 회의</span>
                        </li>
                        <li className={`${styles.header_li} ${styles.attend_meeting}`} onClick={handleAttendMeetingShow}>
                            <i className={`${styles.plus_square_icon} ${"bi bi-plus-square"}`}></i>
                            <span>회의 참가</span>
                        </li>
                    </div>
                </div>
                <New_Meeting_Modal show={NewMeetingModalShow} onHide={handleNewMeetingClose} />
                <Attend_Meeting_Modal show={AttendMeetingModalShow} onHide={handleAttendMeetingClose} />
            </div>
            <div className={styles.meeting_list}>
                <div className={styles.refresh_div}>
                    <i className={`${"bi bi-arrow-clockwise"}`} onClick={(e) => Refresh(e)}></i>
                </div>
                <ul className={styles.meeting_list_ul}>
                    {meeting_rendering(MeetList)}
                </ul>
            </div>
        </div>
    )
};