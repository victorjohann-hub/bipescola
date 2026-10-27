import { setupWebAlertPolyfill } from '../webAlertPolyfill';

describe('setupWebAlertPolyfill', () => {
  it('não deve alterar Alert.alert fora do ambiente web', () => {
    const originalAlert = jest.fn();
    const fakeAlertObj = { alert: originalAlert };
    setupWebAlertPolyfill('ios', fakeAlertObj, {});
    expect(fakeAlertObj.alert).toBe(originalAlert);
  });

  it('deve usar window.alert para alertas simples na web', () => {
    const fakeAlertObj = { alert: () => {} };
    const fakeWindow = { alert: jest.fn(), confirm: jest.fn() };
    setupWebAlertPolyfill('web', fakeAlertObj, fakeWindow);

    const onPress = jest.fn();
    fakeAlertObj.alert('Sucesso', 'Presença confirmada!', [{ text: 'OK', onPress }]);

    expect(fakeWindow.alert).toHaveBeenCalledWith('Sucesso\n\nPresença confirmada!');
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('deve usar window.confirm e acionar ação de confirmação quando houver múltiplos botões', () => {
    const fakeAlertObj = { alert: () => {} };
    const fakeWindow = { alert: jest.fn(), confirm: jest.fn(() => true) };
    setupWebAlertPolyfill('web', fakeAlertObj, fakeWindow);

    const onCancel = jest.fn();
    const onConfirm = jest.fn();
    fakeAlertObj.alert('Sair da Conta', 'Deseja encerrar a sessão?', [
      { text: 'Cancelar', style: 'cancel', onPress: onCancel },
      { text: 'Sair', style: 'destructive', onPress: onConfirm },
    ]);

    expect(fakeWindow.confirm).toHaveBeenCalledWith('Sair da Conta\n\nDeseja encerrar a sessão?');
    expect(onConfirm).toHaveBeenCalledTimes(1);
    expect(onCancel).not.toHaveBeenCalled();
  });

  it('deve acionar callback de cancelamento quando window.confirm retornar false', () => {
    const fakeAlertObj = { alert: () => {} };
    const fakeWindow = { alert: jest.fn(), confirm: jest.fn(() => false) };
    setupWebAlertPolyfill('web', fakeAlertObj, fakeWindow);

    const onCancel = jest.fn();
    const onConfirm = jest.fn();
    fakeAlertObj.alert('Excluir Turma', 'Confirmar exclusão?', [
      { text: 'Cancelar', style: 'cancel', onPress: onCancel },
      { text: 'Excluir', style: 'destructive', onPress: onConfirm },
    ]);

    expect(fakeWindow.confirm).toHaveBeenCalledWith('Excluir Turma\n\nConfirmar exclusão?');
    expect(onCancel).toHaveBeenCalledTimes(1);
    expect(onConfirm).not.toHaveBeenCalled();
  });
});
