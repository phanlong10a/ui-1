import { formatTime } from '../../utils/formatTime';
import { privateRequest, request, API_PATH } from '@/utils/apis';
import { ENVIRONMENTS } from '@/utils/constant';

interface Result {
  list: any[];
}

export const getTableData = (
  { current, pageSize }: { current: number; pageSize: number },
  formData: {
    fullName: string;
  },
): Promise<Result> => {
  if (formData.fullName === undefined) {
    formData.fullName = '';
  }
  const data = {
    page: current - 1,
    size: pageSize
  };

  return privateRequest(request.get, API_PATH.LIST_USER).then(
    (res: any) => {
      const result = res?.payload?.map(
        (e: any, index: any) => ({
          ...e,
          stt: index + 1,
        }),
      );
      return {
        list: result
      }
    },
  );
};

export const deleteAdmin = (id: any) => {
  const query = `
  mutation {
    delete_admin(input: { id: "${id}" })
  }

  `;
  return privateRequest(request.post, API_PATH.default, {
    data: {
      query,
    },
  });
};

export const switchStatusAdmin = (id: any) => {
  const query = `
    mutation {
      switch_status_admin(id: "${id}")
    }
  `;
  return privateRequest(request.post, API_PATH.default, {
    data: {
      query,
    },
  });
};
