
const Title = ({ title, subTitle, align }: { title: string; subTitle?: string; align?: string }) => {
  return (
    <div className={`flex flex-col justify-start items-start text-left mb-6 ${align === 'left' ? 'text-left' : 'text-center'}`}>
      <h1 className='font-semibold text-2xl md:text-3xl text-gray-800'>{title}</h1>
      {subTitle && <p className='text-sm md:text-base text-gray-500/90 mt-1'>{subTitle}</p>}
    </div>
  )
}

export default Title
