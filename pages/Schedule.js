import { useEffect, useState } from 'react'
import styles from '../styles/Schedule.module.css'
import { CreateToDoListModal } from './Modals';
import Dropdown from 'react-bootstrap/Dropdown';
import axios from 'axios';

export const Schedule = () => {
    const [value, onChange] = useState(new Date());
    const [CreateModalShow, SetCreateModalShow] = useState(false);

    const handleCreateModalClose = () => SetCreateModalShow(false);
    const handleCreateModalShow = () => SetCreateModalShow(true);

    const [MemoList, SetMemoList] = useState({});

    const GetMemoInDatabase = async () => {
        var url = "https://wv9wwf.deta.dev/api/database/memo";

        try {
            const resp = await axios.get(url);
            SetMemoList(resp.data);
        } catch (error) {
            console.log(error.response);
            alert('데이터를 가져오는데 문제가 생겼습니다. 관리자에게 문의하세요.');
        }
    }

    const DeleteMemoFromDatabase = async (e) => {
        var memo_number = e.target.id;
        
        var url = `https://wv9wwf.deta.dev/api/database/memo/${memo_number}`;

        try {
            const resp = await axios.delete(url);
            alert('메모를 삭제하였습니다!');
            GetMemoInDatabase();
        } catch (error) {
            alert('메모를 삭제하는데 문제가 생겼습니다. 관리자에게 문의하세요.');
        }
    }

    useEffect(() => {
        GetMemoInDatabase();
    }, [])

    const Memo_rendering = (data) => {
        const result = [];
        for (let i = 0; i < data.length; i++) {
            result.push(
                <div className={`${styles.Card} ${styles.Written}`} key={i}>
                    <div className={styles.Card_header}>
                        <span className={styles.Card_title}>{data[i].title}</span>
                        <Dropdown>
                            <Dropdown.Toggle as='span' bsPrefix='toggle'>
                                <i className="bi bi-three-dots" style={{cursor: 'pointer'}}></i>
                            </Dropdown.Toggle>
                            <Dropdown.Menu id='dropdown-menu'>
                                <Dropdown.Item onClick={DeleteMemoFromDatabase} id={data[i].number}>삭제</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    </div>
                    <div className={styles.Card_body}>
                        <span className={styles.Card_comment}>{data[i].content}</span>
                    </div>
                </div>
            )
        }
        return result;
    }

    return (
        <div className={styles.wrap}>
            <div className={styles.header}>
                <h1>To Do List</h1>
            </div>
            <div className={styles.ToDoList}>
                {Memo_rendering(MemoList)}
                <div className={`${styles.Card} ${styles.Unwritten}`} onClick={handleCreateModalShow}>
                    <i className="bi bi-plus-square-dotted" style={{fontSize: '30px', color: '#adb5bd'}}></i>
                </div>
            </div>
            <CreateToDoListModal show={CreateModalShow} onHide={handleCreateModalClose} />
        </div>
    )
}