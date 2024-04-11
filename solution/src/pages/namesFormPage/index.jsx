import { Container } from 'react-bootstrap';
import { NamesForm } from './namesForm';
import { NamesList } from './namesList';

const NamesFormPage = () => {
    return (
        <>
            <Container
                className="pt-5">
                <NamesForm />
            </Container>
            <Container>
                <NamesList />
            </Container>
        </>
    )
}

export { NamesFormPage };