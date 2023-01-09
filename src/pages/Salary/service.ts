import { formatTime } from '../../utils/formatTime';
import { privateRequest, request, API_PATH } from '@/utils/apis';
import { ENVIRONMENTS } from '@/utils/constant';
import moment from 'moment';

interface Result {
  list: any[];
}

export const getTableData = (
  { current, pageSize }: { current: number; pageSize: number },
  formData: any,
): Promise<Result> => {
  if (formData.months === undefined) {
    formData.months = '';
  }
  const data = {
    page: current,
    size: pageSize,
  };

  return privateRequest(request.post, API_PATH.salary_search, {
    data: {
      ...data,
      ...formData,
      start_date: formData.range ? moment(formData.range[0]).format() : null,
      end_date: formData.range ? moment(formData.range[1]).format() : null,
    },
  }).then((res: any) => {
    console.log('🚀 ~ file: service.ts:37 ~ res', res);
    const result = res?.data.map((e: any, index: any) => ({
      ...e,
      stt: index + 1,
    }));
    return {
      list: result,
      total: res?.total,
    };
  });
};

export const getExcel = (formData: any): Promise<Result> => {
  if (formData.months === undefined) {
    formData.months = '';
  }
  const data = {
    page: 1,
    size: 1,
  };

  return privateRequest(request.post, API_PATH.excel_bill, {
    data: {
      ...data,
      ...formData,
      start_date: formData.range ? moment(formData.range[0]).format() : null,
      end_date: formData.range ? moment(formData.range[1]).format() : null,
    },
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
