import { formatTime } from '../../utils/formatTime';
import { privateRequest, request, API_PATH } from '@/utils/apis';
import { ENVIRONMENTS } from '@/utils/constant';
import { Moment } from 'moment';
import moment from 'moment';

interface Result {
  list: any[];
}

export const getTableData = (
  { current, pageSize }: { current: number; pageSize: number },
  formData: {
    range: Moment[];
    staffCode: string;
  },
): Promise<Result> => {
  console.log('🚀 ~ file: service.ts:18 ~ formData', formData);

  const data = {
    page: current,
    size: pageSize,
  };

  return privateRequest(request.post, API_PATH.dot_information, {
    data: {
      ...data,
      start_date: formData.range ? moment(formData.range[0]).format() : null,
      end_date: formData.range ? moment(formData.range[1]).format() : null,
      staffCode: formData.staffCode,
    },
  }).then((res: any) => {
    console.log('🚀 ~ file: service.ts:32 ~ res', res);
    const result = res?.data?.map((e: any, index: any) => ({
      ...e,
      stt: index + 1,
    }));
    return {
      list: result,
      name: '',
      total: res?.total,
    };
  });
};

export const deleteAdmin = (id: any) => {
  return privateRequest(request.delete, API_PATH.deleteDepartment + id);
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
