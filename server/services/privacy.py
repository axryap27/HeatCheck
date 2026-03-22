from models.schemas import CourtResponse, PrivacyMode


def filter_court_for_privacy(
    court: CourtResponse,
    viewer_session_id: str,
    owner_session_id: str,
    owner_privacy_mode: PrivacyMode,
    friend_session_ids: list[str],
) -> CourtResponse | None:
    """
    TODO (engineer): Implement location privacy filtering.

    This function should determine whether a viewer can see a court ping
    based on the owner's privacy settings:

    - PrivacyMode.PUBLIC:
        Always return the court as-is. All users can see this ping.

    - PrivacyMode.FRIENDS:
        Return the court only if viewer_session_id is in friend_session_ids
        or viewer_session_id == owner_session_id.
        Otherwise return None.

    - PrivacyMode.INCOGNITO:
        Always return None — this player is invisible to all others.
        (The owner themselves can still see their own marker via client-side state.)

    Inputs:
        court (CourtResponse): the court to potentially show
        viewer_session_id (str): the requesting user's session ID
        owner_session_id (str): session ID of the user who pinged
        owner_privacy_mode (PrivacyMode): privacy setting of the pinging user
        friend_session_ids (list[str]): viewer's confirmed friend session IDs

    Returns:
        CourtResponse if the viewer is allowed to see it, None otherwise
    """
    raise NotImplementedError("Privacy filtering not yet implemented")
