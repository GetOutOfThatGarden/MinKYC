import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { VerificationRequestModal } from '../VerificationRequestModal';
import { VerificationRequest } from '../../types/verification';

describe('VerificationRequestModal', () => {
  const mockRequest: VerificationRequest = {
    platformId: 'socialprofile.xyz',
    requestId: '12345',
    condition: 'age >= 18',
    userId: 'Jane Doe',
  };

  it('renders the request details correctly', () => {
    const { getByText } = render(
      <VerificationRequestModal 
        request={mockRequest} 
        visible={true} 
        onApprove={() => {}} 
        onReject={() => {}} 
      />
    );

    expect(getByText('Verification Request')).toBeTruthy();
    expect(getByText(/socialprofile\.xyz/)).toBeTruthy();
    expect(getByText(/age >= 18/)).toBeTruthy();
    expect(getByText(/Jane Doe/)).toBeTruthy();
    expect(getByText(/No personal documents will be shared/)).toBeTruthy();
  });

  it('calls onApprove when the Approve button is pressed', () => {
    const onApproveMock = jest.fn();
    const { getByText } = render(
      <VerificationRequestModal 
        request={mockRequest} 
        visible={true} 
        onApprove={onApproveMock} 
        onReject={() => {}} 
      />
    );

    fireEvent.press(getByText('Approve'));
    expect(onApproveMock).toHaveBeenCalledTimes(1);
  });

  it('calls onReject when the Reject button is pressed', () => {
    const onRejectMock = jest.fn();
    const { getByText } = render(
      <VerificationRequestModal 
        request={mockRequest} 
        visible={true} 
        onApprove={() => {}} 
        onReject={onRejectMock} 
      />
    );

    fireEvent.press(getByText('Reject'));
    expect(onRejectMock).toHaveBeenCalledTimes(1);
  });

  it('does not render when visible is false', () => {
    const { queryByText } = render(
      <VerificationRequestModal 
        request={mockRequest} 
        visible={false} 
        onApprove={() => {}} 
        onReject={() => {}} 
      />
    );

    expect(queryByText('Verification Request')).toBeNull();
  });
});
