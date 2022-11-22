import { privateRequest, request, API_PATH } from '@/utils/apis';

export const getAdmin = (id: any) => {
  const query = `
  mutation {
    get_one_admin(input: { id: "${id}" }) {
      message
      data {
        email
        phone
        id
        status
        admin_profile {
          id
          full_name
          date_of_birth
          address
          date_modified
          date_created
          admin_id
          avatar
        } 
        role {
          id
          role_name
          is_active
          permissions {
            id
            admin_management_level
            role_group_level
            user_management_level
            kyc_management_level
            gift_management_level
            gift_recive_management_level
            item_management_level
            report_management_level
            system_setting_level
          }
        } 
      }
    }
  }
  `;
  return privateRequest(request.post, API_PATH.default, {
    data: { query },
  });
};
