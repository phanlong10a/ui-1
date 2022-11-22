import { useParams } from 'umi';
import { privateRequest, request, API_PATH } from '@/utils/apis';
import { ENVIRONMENTS } from '@/utils/constant';
import moment from 'moment';

interface Result {
  total: number;
  list: any[];
}
export const getOneUser = (userId: any) => {
  const query = `
    mutation {
      get_user_profile(userId: ${userId}) {
        userId
        full_name
        phone
        email
        date_created
        status
        user_profile {
          avatar
          full_name
          date_of_birth
          date_created
          gender
          address
        }
        update_history {
          author
          update_at
          update_field
          old_value
          new_value
        }
        user_identity {
          id
          userId
          request_at
          full_name
          phone
          email
          type_identity
          verification_status
          identity_backside
          identity_front
          verify_image
          date_of_birth
          date_of_issue
          place_of_issue
          identity_id
          address
        }
      }
    }
  `;
  return privateRequest(request.post, API_PATH.default, {
    data: {
      query,
    },
  });
};

export const getDataPickupHistory = (userId: any) => {
  const query = `
  mutation {
    getItemPickUpHistory(userId: ${userId}) {
      receive_time
      gift_pieceId
      name
      receive_at
    }
  }
  `;
  return privateRequest(request.post, API_PATH.default, {
    data: {
      query,
    },
  });
};

export const updateUserInfo = (formData: any) => {
  console.log(
    '🚀 ~ file: service.ts ~ line 66 ~ updateUserInfo ~ formData',
    formData,
  );
  const data = {
    query: `    
      mutation {
        admin_update_user(
          updateInput: {
            userId: ${formData.userId}
            full_name: "${formData.full_name || ''}",
            date_of_birth: "${
              formData.date_of_birth
                ? moment(formData.date_of_birth).format()
                : ''
            }"
            phone: "${formData.phone || ''}"
            email: "${formData.email || ''}"
            gender: "${formData.gender || ''}"
            status: ${formData.status ? 'true' : 'false'}
          }
        ) {
          message
        }
      }
    `,
  };
  return privateRequest(request.post, API_PATH.default, {
    data,
  });
};
export const handleKycService = (
  userId: number | string,
  isAccept: boolean,
  reason?: string,
) => {
  const data = {
    query: `
      mutation {
        admin_handle_kyc_request(handle: { userId: ${userId}, status: ${isAccept}, ${
      reason ? `reason: "${reason}"` : ''
    } }) {
          message
        }
      }    
    `,
  };
  return privateRequest(request.post, API_PATH.default, {
    data,
  });
};
