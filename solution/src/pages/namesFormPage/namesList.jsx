import { Container, Row, Col } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { connect } from 'react-redux';
import { addName } from '../../reducers/nameReducer';

const NamesList = () => {
    const names = useSelector(state => state.names);

    return (
        <Container>
            <Row>
                <Col
                    className="border bg-secondary bg-gradient text-white"
                    sm="3">
                    Name
                </Col>
                <Col
                    className="border bg-secondary bg-gradient text-white"
                    sm="4">
                    Location {names.length}
                </Col>
            </Row>

            {names
                && names.names
                && names.names.map
                && names.names.map((item, index) => {
                    var classes = 'border' + (index % 2 === 0 ? ' bg-light bg-gradient' : '');
                    return (
                        <Row
                            key={index}>
                            <Col
                                className={classes}
                                sm="3">
                                {item.name}
                            </Col>
                            <Col
                                className={classes}
                                sm="4">
                                {item.location}
                            </Col>
                        </Row>
                    );
                })}
        </Container>
    )
}

const mapDispatchToProps = {
    addName
};

export { NamesList };

export default connect(mapDispatchToProps)(NamesList);