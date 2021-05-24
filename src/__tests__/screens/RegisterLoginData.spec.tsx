import React from 'react';
import { fireEvent, render, waitFor } from '@testing-library/react-native';

import { RegisterLoginData } from '../../screens/RegisterLoginData';
import AsyncStorage from '@react-native-async-storage/async-storage';

describe('RegisterLoginData', () => {
  it('should be able to save login data on async storage', async () => {
    const spySetItem = jest.spyOn(AsyncStorage, 'setItem')
      .mockImplementationOnce((key: string, data: any) => Promise.resolve());

    const spyGetItem = jest.spyOn(AsyncStorage, 'getItem')
      .mockReturnValueOnce(
        Promise.resolve(
          JSON.stringify([
            {
              id: '0',
              title: 'LikedIn',
              email: 'johndoelinkedin@example.com',
              password: '123456'
            }
          ])
        )
      )

    jest.spyOn(JSON, 'stringify')
      .mockImplementationOnce((data) => data);

    const { getByPlaceholderText, getByText } = render(
      <RegisterLoginData />
    );

    const titleInput = getByPlaceholderText("Escreva o título aqui");
    const emailInput = getByPlaceholderText("Escreva o Email aqui");
    const passwordInput = getByPlaceholderText("Escreva a senha aqui");
    const submitButton = getByText("Salvar");

    fireEvent.changeText(titleInput, 'Rocketseat');
    fireEvent.changeText(emailInput, 'johndoe@example.com');
    fireEvent.changeText(passwordInput, '123456');
    fireEvent.press(submitButton);

    await waitFor(() => {
      expect(spySetItem).toHaveBeenCalledWith(
        '@passmanager:logins',
        [
          {
            id: '0',
            title: 'LikedIn',
            email: 'johndoelinkedin@example.com',
            password: '123456'
          },
          expect.objectContaining({
            title: 'Rocketseat',
            email: 'johndoe@example.com',
            password: '123456'
          })
        ],
      );

      expect(spyGetItem).toHaveBeenCalledWith('@passmanager:logins');
    });
  });

  it('should be able to show errors message on data validation', async () => {
    const { getByPlaceholderText, getByText } = render(
      <RegisterLoginData />
    );

    const titleInput = getByPlaceholderText("Escreva o título aqui");
    const emailInput = getByPlaceholderText("Escreva o Email aqui");
    const passwordInput = getByPlaceholderText("Escreva a senha aqui");
    const submitButton = getByText("Salvar");

    fireEvent.changeText(titleInput, '');
    fireEvent.changeText(emailInput, '');
    fireEvent.changeText(passwordInput, '');
    fireEvent.press(submitButton);

    await waitFor(() => {
      getByText('Título é obrigatório!')
      getByText('Email é obrigatório!')
      getByText('Senha é obrigatória!')
    });
  });
})