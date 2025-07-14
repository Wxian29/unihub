import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api';
import './CommunityManagePage.css';

const roleOptions = [
  { value: 'admin', label: 'Admin' },
  { value: 'community_leader', label: 'Community Leader' },
  { value: 'member', label: 'mMember' },
];

const CommunityManagePage = () => {
  const { id } = useParams();
  const [community, setCommunity] = useState(null);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editName, setEditName] = useState('');
  const [editDesc, setEditDesc] = useState('');
  // Add state for tags
  const [allTags, setAllTags] = useState([]);
  const [editTags, setEditTags] = useState([]);

  useEffect(() => {
    fetchData();
    fetchTags();
    // eslint-disable-next-line
  }, [id]);

  // Fetch all available tags
  const fetchTags = async () => {
    try {
      const res = await api.get('/communities/tags/');
      // Ensure the result is always an array
      if (Array.isArray(res.data)) {
        setAllTags(res.data);
      } else if (Array.isArray(res.data.results)) {
        setAllTags(res.data.results);
      } else {
        setAllTags([]);
      }
    } catch (err) {
      setAllTags([]); // fallback to empty array on error
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const [communityRes, membersRes] = await Promise.all([
        api.get(`/communities/${id}/`),
        api.get(`/communities/${id}/members/`)
      ]);
      setCommunity(communityRes.data);
      setEditName(communityRes.data.name);
      setEditDesc(communityRes.data.description);
      // Set initial tags as id array
      setEditTags(Array.isArray(communityRes.data.tags) ? communityRes.data.tags.map(tag => tag.id || tag) : []);
      setMembers(Array.isArray(membersRes.data) ? membersRes.data : membersRes.data.results || []);
      setError(null);
    } catch (err) {
      setError('Failed to load community information');
    } finally {
      setLoading(false);
    }
  };

  // Remove Member
  const handleRemove = async (memberId) => {
    if (!window.confirm('Are you sure you want to remove this member?')) return;
    setSaving(true);
    try {
      await api.patch(`/communities/${id}/members/${memberId}/`, { is_active: false });
      await fetchData();
    } catch (err) {
      alert('Removal failed');
    } finally {
      setSaving(false);
    }
  };

  // Save community information, including tags
  const handleSaveInfo = async () => {
    if (!editName.trim()) {
      alert('Community name cannot be empty');
      return;
    }
    setSaving(true);
    try {
      await api.patch(`/communities/${id}/`, { name: editName, description: editDesc, tags: editTags });
      setEditMode(false);
      await fetchData();
    } catch (err) {
      alert('Save failed');
    } finally {
      setSaving(false);
    }
  };

  // Handle tag selection change
  const handleTagsChange = (e) => {
    const options = Array.from(e.target.selectedOptions);
    setEditTags(options.map(opt => Number(opt.value)));
  };

  if (loading) {
    return <div className="community-manage-page"><div className="container"><div className="loading">loading...</div></div></div>;
  }
  if (error) {
    return <div className="community-manage-page"><div className="container"><div className="error-message">{error}</div></div></div>;
  }
  if (!community) {
    return null;
  }

  return (
    <div className="community-manage-page">
      <div className="container">
        <h1>Managing the community:{community.name}</h1>
        <div className="community-info">
          {editMode ? (
            <>
              <div className="form-group">
                <label>Community Name</label>
                <input
                  className="form-control"
                  value={editName}
                  onChange={e => setEditName(e.target.value)}
                  disabled={saving}
                />
              </div>
              <div className="form-group">
                <label>Introduction</label>
                <textarea
                  className="form-control"
                  value={editDesc}
                  onChange={e => setEditDesc(e.target.value)}
                  rows={3}
                  disabled={saving}
                />
              </div>
              {/* Tag selection */}
              <div className="form-group">
                <label>Tags</label>
                <select
                  className="form-control"
                  multiple
                  value={editTags}
                  onChange={handleTagsChange}
                  disabled={saving}
                >
                  {Array.isArray(allTags) && allTags.map(tag => (
                    <option key={tag.id} value={tag.id}>{tag.name}</option>
                  ))}
                </select>
                <div className="hint">Hold Ctrl (Windows) or Command (Mac) to select multiple tags</div>
              </div>
              <button className="btn btn-primary" onClick={handleSaveInfo} disabled={saving}>save</button>
              <button className="btn btn-outline" style={{marginLeft:8}} onClick={() => setEditMode(false)} disabled={saving}>cancel</button>
            </>
          ) : (
            <>
              <p><strong>Introduction:</strong>{community.description}</p>
              <p><strong>Number of Members:</strong>{community.member_count}</p>
              {/* Show tags */}
              <p><strong>Tags:</strong> {Array.isArray(community.tags) && community.tags.length > 0
                ? community.tags
                    .map(tagId => {
                      // Find tag object by id from allTags
                      const tagObj = allTags.find(t => t.id === (tagId.id || tagId));
                      return tagObj ? tagObj.name : (tagId.name || tagId);
                    })
                    .join(', ')
                : 'None'}</p>
              <button className="btn btn-outline" onClick={() => setEditMode(true)}>Edit community information</button>
            </>
          )}
        </div>
        <h2>Members List</h2>
        <div className="member-list">
          {members.filter(m => m.is_active).length === 0 && <div>No members yet</div>}
          {members.filter(m => m.is_active).map((member) => (
            <div className="member-item" key={member.id}>
              <span>{member.user_name}</span>
              <button
                className="btn btn-outline btn-sm"
                style={{ marginLeft: 8 }}
                onClick={() => handleRemove(member.id)}
                disabled={saving}
              >Remove</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CommunityManagePage; 