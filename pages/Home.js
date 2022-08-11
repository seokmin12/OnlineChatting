import { useState, useEffect } from 'react'
import styles from '../styles/Home.module.css'
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import ListGroup from 'react-bootstrap/ListGroup';

export const Home = (props) => {

    return (
        <div className={styles.wrap}>
            <div className={styles.cards}>
                <Row xs={1} md={2} className="g-4">
                    <Col className={styles.small_card_col}>
                        <Card bg='secondary' text='white' className={styles.small_card}>
                            <Card.Header className='d-flex justify-content-between align-items-center'>
                                프로필
                                <i className="bi bi-pencil" style={{cursor: 'pointer'}}></i>
                            </Card.Header>
                            <Card.Img style={{width: '90%', margin: 'auto'}} variant="top" src="https://cdn.landesa.org/wp-content/uploads/default-user-image.png" />
                            <Card.Body>
                                <Card.Title>이석민</Card.Title>
                                <Card.Text>Some quick example text to build on the card title</Card.Text>
                            </Card.Body>
                        </Card>
                        <Card className={styles.small_card}>
                            <Card.Body>
                                <div className={styles.CardTitle}>
                                    <Card.Title>메모</Card.Title>
                                    <span onClick={() => props.setMenu('Schedule')} style={{cursor: 'pointer', color: '#ADB5BD'}}>상세보기</span>
                                </div>
                                <ListGroup className='list-group-flush'>
                                    <ListGroup.Item>Dapibus ac facilisis in</ListGroup.Item>
                                    <ListGroup.Item>Morbi leo risus</ListGroup.Item>
                                    <ListGroup.Item>Porta ac consectetur ac</ListGroup.Item>
                                </ListGroup>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col>
                        <Card>
                            <Card.Body>
                                <div className={styles.CardTitle}>
                                    <Card.Title>연락처</Card.Title>
                                    <span style={{cursor: 'pointer', color: '#ADB5BD'}}>상세보기</span>
                                </div>
                                <ListGroup className="list-group-flush">
                                    <ListGroup.Item>Cras justo odio</ListGroup.Item>
                                    <ListGroup.Item>Dapibus ac facilisis in</ListGroup.Item>
                                    <ListGroup.Item>Vestibulum at eros</ListGroup.Item>
                                    <ListGroup.Item>Cras justo odio</ListGroup.Item>
                                    <ListGroup.Item>Dapibus ac facilisis in</ListGroup.Item>
                                    <ListGroup.Item>Vestibulum at eros</ListGroup.Item>
                                </ListGroup>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col>
                        <Card>
                            <Card.Header className='d-flex justify-content-between'>
                                🏆 랭킹
                                <span style={{cursor: 'pointer', color: '#ADB5BD'}}>더보기</span>
                                </Card.Header>
                            <Card.Body>
                                <ListGroup as='ol' numbered>
                                    <ListGroup.Item as='li'>이석민</ListGroup.Item>
                                    <ListGroup.Item as='li'>이석민</ListGroup.Item>
                                    <ListGroup.Item as='li'>이석민</ListGroup.Item>
                                </ListGroup>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col>
                        <Card>
                            <Card.Header className='d-flex justify-content-between'>
                                📣 공지사항
                                <span style={{cursor: 'pointer', color: '#ADB5BD'}}>더보기</span>
                                </Card.Header>
                            <Card.Body>
                                <ListGroup as='ol' numbered>
                                    <ListGroup.Item as='li'>공지사항</ListGroup.Item>
                                    <ListGroup.Item as='li'>공지사항</ListGroup.Item>
                                    <ListGroup.Item as='li'>공지사항</ListGroup.Item>
                                </ListGroup>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </div>
        </div>
    )
}