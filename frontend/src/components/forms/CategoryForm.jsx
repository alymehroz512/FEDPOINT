import { useForm } from 'react-hook-form';

const CategoryForm = ({ onSubmit, defaultValues = {} }) => {
  const { register, handleSubmit } = useForm({ defaultValues });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="mb-3">
        <label className="form-label">Category Name</label>
        <input className="form-control" {...register('name', { required: true })} />
      </div>
      <div className="mb-3">
        <label className="form-label">Subcategories (comma separated)</label>
        <input className="form-control" {...register('subcategories')} placeholder="e.g., Laptop, Desktop, Tablet" />
      </div>
      <button type="submit" className="btn btn-primary">Save Category</button>
    </form>
  );
};

export default CategoryForm;
