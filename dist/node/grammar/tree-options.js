'use strict';

var _module$exports;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

// Reuse these fields because there are 2 URL structures for accessing repositores:
// - `/repos/philschatz/octokat.js/...`
// - `/repositories/20044005/...`
var REPO_FIELDS = {
  'readme': false,
  'tarball': false,
  'zipball': false,
  'compare': false,
  'deployments': {
    'statuses': false
  },
  'hooks': {
    'tests': false
  },
  'assignees': false,
  'languages': false,
  'teams': false,
  'tags': false,
  'branches': false,
  'contributors': false,
  'subscribers': false,
  'subscription': false,
  'stargazers': false,
  'comments': false,
  'downloads': false,
  'forks': false,
  'milestones': {
    'labels': false
  },
  'labels': false,
  'releases': {
    'assets': false,
    'latest': false,
    'tags': false
  },
  'events': false,
  'notifications': false,
  'merges': false,
  'statuses': false,
  'pulls': {
    'merge': false,
    'comments': false,
    'commits': false,
    'files': false,
    'events': false,
    'labels': false,
    'requested_reviewers': false,
    'reviews': {
      'comments': false,
      'events': false,
      'dismissals': false
    }
  },
  'pages': {
    'builds': {
      'latest': false
    }
  },
  'commits': {
    'comments': false,
    'status': false,
    'statuses': false
  },
  'contents': false,
  'collaborators': {
    'permission': false
  },
  'projects': false,
  'issues': {
    'events': false,
    'comments': false,
    'labels': false
  },
  'git': {
    'refs': {
      'heads': false,
      'tags': false
    },
    'trees': false,
    'blobs': false,
    'commits': false,
    'tags': false
  },
  'stats': {
    'contributors': false,
    'commit_activity': false,
    'code_frequency': false,
    'participation': false,
    'punch_card': false
  },
  'traffic': {
    'popular': {
      'referrers': false,
      'paths': false
    },
    'views': false,
    'clones': false
  }
};

module.exports = (_module$exports = {
  'zen': false,
  'octocat': false,
  'organizations': false,
  'issues': false,
  'emojis': false,
  'markdown': false,
  'meta': false,
  'rate_limit': false,
  'feeds': false,
  'events': false,
  'repositories': false,
  'notifications': {
    'threads': {
      'subscription': false
    }
  },
  'gitignore': {
    'templates': false
  },
  'user': {
    'repos': false,
    'orgs': false,
    'followers': false,
    'following': false,
    'emails': false,
    'issues': false,
    'public_emails': false,
    'starred': false,
    'teams': false
  },
  'orgs': {
    'repos': false,
    'issues': false,
    'members': false,
    'events': false,
    'projects': false,
    'teams': false
  },
  'projects': {
    'columns': {
      'moves': false,
      'cards': {
        'moves': false
      }
    }
  },
  'teams': {
    'members': false,
    'memberships': false,
    'repos': false
  },
  'users': {
    'repos': false,
    'orgs': false,
    'gists': false,
    'followers': false,
    'following': false,
    'keys': false,
    'starred': false,
    'received_events': {
      'public': false
    },
    'events': {
      'public': false,
      'orgs': false
    },
    // Enterprise-only:
    'site_admin': false,
    'suspended': false
  },

  'search': {
    'repositories': false,
    'commits': false,
    'issues': false,
    'users': false,
    'code': false
  },
  'gists': {
    'public': false,
    'starred': false,
    'star': false,
    'comments': false,
    'forks': false
  },
  'repos': REPO_FIELDS
}, _defineProperty(_module$exports, 'repositories', REPO_FIELDS), _defineProperty(_module$exports, 'licenses', false), _defineProperty(_module$exports, 'authorizations', {
  'clients': false
}), _defineProperty(_module$exports, 'applications', {
  'tokens': false
}), _defineProperty(_module$exports, 'enterprise', {
  'settings': {
    'license': false
  },
  'stats': {
    'issues': false,
    'hooks': false,
    'milestones': false,
    'orgs': false,
    'comments': false,
    'pages': false,
    'users': false,
    'gists': false,
    'pulls': false,
    'repos': false,
    'all': false
  }
}), _defineProperty(_module$exports, 'staff', {
  'indexing_jobs': false
}), _defineProperty(_module$exports, 'setup', {
  'api': {
    'start': false, // POST
    'upgrade': false, // POST
    'configcheck': false, // GET
    'configure': false, // POST
    'settings': { // GET/PUT
      'authorized-keys': false // GET/POST/DELETE
    },
    'maintenance': false // GET/POST
  }
}), _module$exports);
//# sourceMappingURL=tree-options.js.map