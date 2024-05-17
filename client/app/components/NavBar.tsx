export default function NavBar() {
    return (
      <div className="flex flex-row p-3 m:p-6 lg:p-9 justify-between align-center">
        <div className="font-bold">LOGO</div>
        <div className="flex flex-row gap-3 m:gap-4.5 lg:gap-6">
            <div>Join</div>
            <div>SignIn</div>
        </div>
      </div>
    );
  }