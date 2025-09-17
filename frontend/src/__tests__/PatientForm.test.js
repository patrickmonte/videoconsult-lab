import { render, screen, fireEvent } from '@testing-library/react';
import PatientForm from '../components/PatientForm';

describe('PatientForm', () => {
  it('renderiza campos obrigatórios', () => {
    render(<PatientForm />);
    expect(screen.getByLabelText(/Nome Completo/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/CPF/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/E-mail/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Telefone/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Data de Nascimento/i)).toBeInTheDocument();
  });

  it('valida envio do formulário', () => {
    render(<PatientForm />);
    fireEvent.change(screen.getByLabelText(/Nome Completo/i), { target: { value: 'Paciente Teste', name: 'name' } });
    fireEvent.change(screen.getByLabelText(/CPF/i), { target: { value: '12345678900', name: 'cpf' } });
    fireEvent.change(screen.getByLabelText(/E-mail/i), { target: { value: 'teste@teste.com', name: 'email' } });
    fireEvent.change(screen.getByLabelText(/Telefone/i), { target: { value: '11999999999', name: 'phone' } });
    fireEvent.change(screen.getByLabelText(/Data de Nascimento/i), { target: { value: '2000-01-01', name: 'birthDate' } });
    fireEvent.click(screen.getByRole('button', { name: /Cadastrar/i }));
    // Aqui pode-se simular fetch e testar resposta
  });
});
