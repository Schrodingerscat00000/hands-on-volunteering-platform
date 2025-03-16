import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Events from './pages/Events';
import Profile from './pages/Profile';
import HelpRequests from './pages/HelpRequests';
import EventCreation from './pages/EventCreation';
import TeamCreation from './pages/TeamCreation';
import Teams from './pages/Teams';
import TeamDashboard from './pages/TeamDashboard';
import Leaderboard from './pages/Leaderboard';

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/" exact component={Home} />
        <Route path="/login" component={Login} />
        <Route path="/register" component={Register} />
        <Route path="/events" component={Events} />
        <Route path="/profile" component={Profile} />
        <Route path="/help-requests" component={HelpRequests} />
        <Route path="/event-creation" component={EventCreation} />
        <Route path="/team-creation" component={TeamCreation} />
        <Route path="/teams" component={Teams} />
        <Route path="/team/:id" component={TeamDashboard} />
        <Route path="/leaderboard" component={Leaderboard} />
      </Switch>
    </Router>
  );
}

export default App;