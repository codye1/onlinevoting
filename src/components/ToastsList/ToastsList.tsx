import { useAppDispatch, useAppSelector } from '@hooks/hooks';
import close from '@public/close.svg';
import { removeToast } from '@reducer/toasts';
const ToastsList = () => {
  const toasts = useAppSelector((state) => state.toasts);
  const dispatch = useAppDispatch();
  return (
    <ul className="fixed bottom-0 right-0 z-50">
      {toasts.map((toast) => (
        <li
          key={toast.id}
          className={`m-4 p-4 rounded shadow-m text-default bg-foreground ${
            toast.type === 'success'
              ? 'text-success'
              : toast.type === 'error'
                ? 'text-error'
                : toast.type === 'warning'
                  ? 'text-warning'
                  : ''
          } flex justify-between  items-center`}
        >
          {toast.message}
          <img
            className="w-[20px] h-[20px] ml-2 inline-block cursor-pointer icon-bw"
            src={close}
            alt="Close"
            onClick={() => dispatch(removeToast(toast.id))}
          />
        </li>
      ))}
    </ul>
  );
};

export default ToastsList;
